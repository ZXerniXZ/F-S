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
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    uniforms.resolution.value.x = container.clientWidth
    uniforms.resolution.value.y = container.clientHeight

    container.appendChild(renderer.domElement)

    // Handle interaction
    const handleInteraction = (clientX: number, clientY: number) => {
        if (!sceneRef.current) return;

        const rect = container.getBoundingClientRect();
        
        // CRITICAL FIX: Calculate scale factor between visual size (rect) and internal resolution (clientWidth)
        // This accounts for CSS transforms like scale(1.1) used in the Hero component
        const scaleX = container.clientWidth / rect.width;
        const scaleY = container.clientHeight / rect.height;

        // Calculate X relative to the element, then scale to internal canvas coordinates
        const mouseX = (clientX - rect.left) * scaleX;
        
        // Calculate Y relative to element (flipped for WebGL), then scale
        const mouseY = (rect.height - (clientY - rect.top)) * scaleY;
        
        // Update the current wave in the ring buffer
        const idx = sceneRef.current.currentWaveIndex;
        const waves = sceneRef.current.uniforms.uWaves.value;
        
        waves[idx].set(mouseX, mouseY, sceneRef.current.uniforms.time.value);
        
        // Advance index (Ring buffer)
        sceneRef.current.currentWaveIndex = (idx + 1) % MAX_WAVES;
    }

    const onClick = (e: MouseEvent) => {
        handleInteraction(e.clientX, e.clientY);
    }

    window.addEventListener("click", onClick);

    // Handle window resize
    const onWindowResize = () => {
      if (!container) return;
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = width
      uniforms.resolution.value.y = height
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

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize)
      window.removeEventListener("click", onClick)

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
