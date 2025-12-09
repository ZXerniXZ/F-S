import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  // Use refs for direct DOM manipulation (Performance: 60fps+)
  const cursorRef = useRef<HTMLDivElement>(null);
  const pointRef = useRef<HTMLDivElement>(null);
  
  // Only use state for visual changes (hover effect), not position
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Direct DOM update loop for performance
    const updatePosition = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      
      // Update opacity on first move. 
      // Calling state setter repeatedly with same value is safe in React (no re-render).
      setIsVisible(true);

      // Directly set transform to avoid React Render Cycle
      const x = e.clientX;
      const y = e.clientY;
      
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', updatePosition);

    // Attach listeners to interactive elements
    const attachListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, .cursor-pointer');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
      return interactiveElements;
    };

    let elements = attachListeners();

    // Observer to attach listeners to dynamic elements (like modal close buttons)
    const observer = new MutationObserver((mutations) => {
        let shouldReattach = false;
        mutations.forEach((mutation) => {
           if (mutation.addedNodes.length > 0) shouldReattach = true;
        });
        
        if (shouldReattach) {
            // Clean up old listeners first (simple approach)
             elements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            elements = attachListeners();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference will-change-transform transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        // Initial position off-screen or 0,0 - updated immediately by JS
        left: 0,
        top: 0,
      }}
    >
      <div
        ref={pointRef}
        className={`relative -translate-x-1/2 -translate-y-1/2 rounded-full border border-white transition-all duration-300 ease-out flex items-center justify-center
        ${isHovering 
            ? 'w-12 h-12 bg-white/10' 
            : 'w-5 h-5 bg-transparent'
        }
        `}
      >
        {/* Tiny center point for precision */}
        <div className={`bg-white rounded-full transition-all duration-300 ${isHovering ? 'w-0.5 h-0.5 opacity-50' : 'w-1 h-1 opacity-100'}`} />
      </div>
    </div>
  );
};

export default CustomCursor;