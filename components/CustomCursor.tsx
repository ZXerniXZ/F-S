import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', updatePosition);

    // Attach listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .cursor-pointer');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Observer to attach listeners to dynamic elements (like modal close buttons)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            const newElements = document.querySelectorAll('a, button, input, textarea, .cursor-pointer');
            newElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter); // Prevent duplicates
                el.removeEventListener('mouseleave', handleMouseLeave);
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      observer.disconnect();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="custom-cursor fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div
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