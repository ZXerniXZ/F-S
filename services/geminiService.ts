import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageGenerationConfig } from "../types";

// Initialize the client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not defined");
  }
  return new GoogleGenAI({ apiKey });
};

export const streamChat = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  onChunk: (text: string) => void,
  systemInstruction?: string
) => {
  const ai = getClient();
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction: systemInstruction || "You are a helpful, creative, and intelligent AI assistant provided by GenAI Studio.",
    },
  });

  const result = await chat.sendMessageStream({ message: newMessage });
  
  for await (const chunk of result) {
    const c = chunk as GenerateContentResponse;
    if (c.text) {
      onChunk(c.text);
    }
  }
};

export const generateTextCompletion = async (
  prompt: string,
  systemInstruction?: string
): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
    }
  });
  return response.text || "";
};

export const generateImage = async (
  prompt: string,
  config: ImageGenerationConfig
): Promise<{ imageUrl?: string; text?: string }> => {
  const ai = getClient();
  
  // Using gemini-2.5-flash-image for image generation/editing capabilities
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image', 
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: config.aspectRatio,
      },
      // Ensure we don't set unsupported schemas/mimetypes for image generation
    },
  });

  let imageUrl: string | undefined;
  let textOutput: string | undefined;

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        imageUrl = `data:image/png;base64,${base64EncodeString}`;
      } else if (part.text) {
        textOutput = part.text;
      }
    }
  }

  return { imageUrl, text: textOutput };
};