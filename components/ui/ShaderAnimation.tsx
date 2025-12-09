
"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ShaderAnimationProps {
    imageUrl?: string;
}

export function ShaderAnimation({ imageUrl }: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: any
    animationId: number
    currentWaveIndex: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const MAX_WAVES = 4;
    const WAVE_LIFETIME = 4.0; // Seconds

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader
    const fragmentShader = `
      precision highp float;
      
      varying vec2 vUv;
      uniform vec2 resolution;
      uniform vec2 imageResolution; // New uniform for image dimensions
      uniform float time;
      uniform sampler2D uTexture;
      uniform bool uHasTexture;
      
      // Array of waves: .x = x_pos, .y = y_pos, .z = start_time
      uniform vec3 uWaves[${MAX_WAVES}]; 

      void main(void) {
        // Aspect corrected UVs for circle calculations (Physical screen space)
        vec2 aspectUV = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        
        vec3 lightColor = vec3(0.0);
        vec2 displacement = vec2(0.0);
        float lineWidth = 0.005; // Increased width for better visibility
        
        // --- WAVE CALCULATION LOOP ---
        for(int k=0; k < ${MAX_WAVES}; k++) {
            vec3 wave = uWaves[k];
            float startTime = wave.z;
            
            if (startTime < 0.0) continue;

            float elapsed = time - startTime;
            if (elapsed < 0.0 || elapsed > ${WAVE_LIFETIME.toFixed(1)}) continue;

            // Wave center in aspect-corrected space
            vec2 waveCenter = (wave.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

            // Distance & Direction
            float dist = distance(aspectUV, waveCenter);
            vec2 dir = normalize(aspectUV - waveCenter);

            float speed = 0.8;
            float waveRadius = elapsed * speed;
            
            // Fading
            float alpha = 1.0 - smoothstep(0.0, ${WAVE_LIFETIME.toFixed(1)}, elapsed);
            
            // --- DISTORTION LOGIC ---
            float distortionStrength = 0.05 * alpha; 
            float distortionWidth = 0.15;
            float waveImpulse = exp(-pow((dist - waveRadius) / distortionWidth, 2.0));
            
            displacement -= dir * waveImpulse * distortionStrength;

            // --- LIGHTING LOGIC ---
            vec3 waveLight = vec3(0.0);
            for(int j = 0; j < 3; j++){ 
              for(int i=0; i < 3; i++){
                float wavePos = waveRadius - 0.02*float(j) + float(i)*0.01;
                float ripple = abs(wavePos * 5.0 - dist * 5.0 + mod(aspectUV.x+aspectUV.y, 0.2));
                // Increased multiplier from 2.0 to 6.0 for intense white glow
                waveLight[j] += (lineWidth * 6.0) * float(i*i) / max(0.001, ripple);
              }
            }
            lightColor += waveLight * alpha;
        }

        // --- FINAL COMPOSITION ---
        vec4 finalOutput = vec4(0.0, 0.0, 0.0, 1.0);

        if (uHasTexture) {
            // --- ASPECT RATIO CORRECTION (COVER MODE) ---
            float screenAspect = resolution.x / resolution.y;
            float imageAspect = imageResolution.x / imageResolution.y;
            
            vec2 newUv = vUv;
            
            if (screenAspect > imageAspect) {
                // Screen is wider than image: Fit Width, Crop Height
                // We map screen 0..1 to a subset of texture Y to zoom in
                float scale = imageAspect / screenAspect;
                newUv.y = (vUv.y - 0.5) * scale + 0.5;
            } else {
                // Screen is taller than image: Fit Height, Crop Width
                // We map screen 0..1 to a subset of texture X to zoom in
                float scale = screenAspect / imageAspect;
                newUv.x = (vUv.x - 0.5) * scale + 0.5;
            }

            // Apply displacement to the corrected UVs
            vec2 distortedUv = newUv + displacement;
            
            // Check boundaries (optional in cover mode, but keeps edges clean if wave pushes too far)
            if (distortedUv.x < 0.0 || distortedUv.x > 1.0 || distortedUv.y < 0.0 || distortedUv.y > 1.0) {
                 finalOutput = vec4(lightColor, 1.0);
            } else {
                vec4 texColor = texture2D(uTexture, distortedUv);
                
                // Grayscale
                float grey = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
                vec3 bgBase = vec3(grey); 
                
                // Add lights on top
                finalOutput = vec4(bgBase + lightColor, 1.0);
            }
        } else {
            finalOutput = vec4(lightColor, 1.0);
        }
        
        gl_FragColor = finalOutput;
      }
    `

    // Initialize Three.js scene
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    // Initialize waves array with negative start time (inactive)
    const initialWaves = new Array(MAX_WAVES).fill(0).map(() => new THREE.Vector3(0, 0, -100.0));

    // Load Texture if URL provided
    let texture: THREE.Texture | null = null;
    
    const uniforms = {
      time: { type: "f", value: 0.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      imageResolution: { type: "v2", value: new THREE.Vector2(1, 1) }, // Default 1:1
      uWaves: { value: initialWaves },
      uTexture: { value: null },
      uHasTexture: { value: false }
    }

    if (imageUrl) {
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin("anonymous");
        
        texture = loader.load(
            imageUrl, 
            (tex) => {
                tex.minFilter = THREE.LinearFilter;
                tex.magFilter = THREE.LinearFilter;
                uniforms.uTexture.value = tex;
                uniforms.uHasTexture.value = true;
                // Store actual image dimensions
                uniforms.imageResolution.value.x = tex.image.width;
                uniforms.imageResolution.value.y = tex.image.height;
            },
            undefined, 
            (err) => {
                console.error("Error loading texture:", err);
            }
        );
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: false,
      depthWrite: false,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const dpr = window.devicePixelRatio || 1;
    renderer.setPixelRatio(dpr)
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height)
    uniforms.resolution.value.x = width * dpr
    uniforms.resolution.value.y = height * dpr

    container.appendChild(renderer.domElement)

    // Handle interaction
    const handleInteraction = (clientX: number, clientY: number) => {
        if (!sceneRef.current) return;

        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        const scaleX = container.clientWidth / rect.width;
        const scaleY = container.clientHeight / rect.height;

        const cssMouseX = (clientX - rect.left) * scaleX;
        const cssMouseY = (rect.height - (clientY - rect.top)) * scaleY;

        const physicalMouseX = cssMouseX * dpr;
        const physicalMouseY = cssMouseY * dpr;
        
        const waves = sceneRef.current.uniforms.uWaves.value;
        const currentTime = sceneRef.current.uniforms.time.value;
        
        // Find the first available wave slot (finished or inactive)
        let freeSlotIndex = -1;
        
        for(let i = 0; i < MAX_WAVES; i++) {
            const w = waves[i];
            const elapsed = currentTime - w.z;
            
            // Check if wave is inactive (negative start time) or finished (elapsed > lifetime)
            if (w.z < 0 || elapsed > WAVE_LIFETIME) {
                freeSlotIndex = i;
                break; // Found one, stop searching
            }
        }

        // Only generate wave if a slot is free
        if (freeSlotIndex !== -1) {
            waves[freeSlotIndex].set(physicalMouseX, physicalMouseY, currentTime);
        }
    }

    const onClick = (e: MouseEvent) => handleInteraction(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleInteraction(touch.clientX, touch.clientY);
        }
    }

    window.addEventListener("click", onClick);
    window.addEventListener("touchstart", onTouch, { passive: true });

    const onWindowResize = () => {
      if (!container) return;
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = width * dpr
      uniforms.resolution.value.y = height * dpr
    }

    window.addEventListener("resize", onWindowResize, false)

    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.015
      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    sceneRef.current = {
      camera, scene, renderer, uniforms, animationId: 0, currentWaveIndex: 0
    }

    animate()

    setTimeout(() => {
        if (container) {
            const rect = container.getBoundingClientRect();
            handleInteraction(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    }, 500);

    return () => {
      window.removeEventListener("resize", onWindowResize)
      window.removeEventListener("click", onClick)
      window.removeEventListener("touchstart", onTouch)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        if (container && sceneRef.current.renderer.domElement) {
            if(container.contains(sceneRef.current.renderer.domElement)) {
                container.removeChild(sceneRef.current.renderer.domElement)
            }
        }
        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
        if (texture) texture.dispose();
      }
    }
  }, [imageUrl])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        background: "#020617", 
        overflow: "hidden",
      }}
    />
  )
}
