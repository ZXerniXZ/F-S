"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ShaderAnimation() {
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
    const MAX_WAVES = 20; // Maximum number of concurrent shockwaves

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      // Array of waves: .x = x_pos, .y = y_pos, .z = start_time
      uniform vec3 uWaves[${MAX_WAVES}]; 

      void main(void) {
        // Calculate coordinate system
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        
        vec3 finalColor = vec3(0.0);
        float lineWidth = 0.002;
        
        // Iterate through all possible waves
        for(int k=0; k < ${MAX_WAVES}; k++) {
            vec3 wave = uWaves[k];
            float startTime = wave.z;
            
            // If wave hasn't started (z < 0), skip
            if (startTime < 0.0) continue;

            float elapsed = time - startTime;

            // If animation finished (after 4 seconds), skip to save processing visually
            if (elapsed < 0.0 || elapsed > 4.0) continue;

            // Coordinate for this specific wave click
            vec2 waveUV = (wave.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

            // Expansion logic
            float speed = 0.8;
            float expansion = elapsed * speed;
            
            // Distance from click point
            float dist = distance(uv, waveUV);
            
            // Fade out based on time
            float alpha = 1.0 - smoothstep(0.0, 4.0, elapsed);

            vec3 waveColor = vec3(0.0);
            
            // Render loops for this wave
            for(int j = 0; j < 3; j++){
              for(int i=0; i < 5; i++){
                float wavePos = expansion - 0.02*float(j) + float(i)*0.01;
                float ripple = abs(wavePos * 5.0 - dist * 5.0 + mod(uv.x+uv.y, 0.2));
                
                // Accumulate color for this specific wave
                waveColor[j] += lineWidth * float(i*i) / max(0.001, ripple); // avoid div by zero
              }
            }
            
            // Add weighted by alpha
            finalColor += waveColor * alpha;
        }
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `

    // Initialize Three.js scene
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    // Initialize waves array with negative time (inactive)
    const initialWaves = new Array(MAX_WAVES).fill(0).map(() => new THREE.Vector3(0, 0, -10.0));

    const uniforms = {
      time: { type: "f", value: 0.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      uWaves: { value: initialWaves },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // Makes overlapping waves brighter
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    const dpr = window.devicePixelRatio || 1;
    renderer.setPixelRatio(dpr)
    
    // IMPORTANT: Set uniform resolution to physical pixels (width * dpr)
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
        
        // Scale factor for CSS transforms (e.g. scale(1.1) in Hero)
        const scaleX = container.clientWidth / rect.width;
        const scaleY = container.clientHeight / rect.height;

        // 1. Calculate relative position in CSS pixels
        // 2. Scale by internal/visual ratio (to fix CSS transforms)
        // 3. Multiply by DPR to match gl_FragCoord (Physical Pixels)
        const cssMouseX = (clientX - rect.left) * scaleX;
        const cssMouseY = (rect.height - (clientY - rect.top)) * scaleY; // Flip Y for WebGL

        const physicalMouseX = cssMouseX * dpr;
        const physicalMouseY = cssMouseY * dpr;
        
        // Update the current wave in the ring buffer
        const idx = sceneRef.current.currentWaveIndex;
        const waves = sceneRef.current.uniforms.uWaves.value;
        
        waves[idx].set(physicalMouseX, physicalMouseY, sceneRef.current.uniforms.time.value);
        
        // Advance index (Ring buffer)
        sceneRef.current.currentWaveIndex = (idx + 1) % MAX_WAVES;
    }

    // Mouse Handler
    const onClick = (e: MouseEvent) => {
        handleInteraction(e.clientX, e.clientY);
    }

    // Touch Handler (Mobile)
    const onTouch = (e: TouchEvent) => {
        // We do NOT prevent default here to allow scrolling.
        // We just want to capture the position for the effect.
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleInteraction(touch.clientX, touch.clientY);
        }
    }

    window.addEventListener("click", onClick);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    // Handle window resize
    const onWindowResize = () => {
      if (!container) return;
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth
      const height = container.clientHeight
      
      renderer.setSize(width, height)
      
      // Update uniforms with physical pixel size
      uniforms.resolution.value.x = width * dpr
      uniforms.resolution.value.y = height * dpr
    }

    window.addEventListener("resize", onWindowResize, false)

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.015
      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
      currentWaveIndex: 0
    }

    // Start animation
    animate()

    // --- INITIAL AUTO-TRIGGER ---
    // Trigger one wave at the center after a short delay to ensure everything is rendered
    setTimeout(() => {
        if (container) {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            handleInteraction(centerX, centerY);
        }
    }, 500);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize)
      window.removeEventListener("click", onClick)
      window.removeEventListener("touchstart", onTouch)
      window.removeEventListener("touchmove", onTouch)

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
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        background: "transparent", 
        overflow: "hidden",
      }}
    />
  )
}