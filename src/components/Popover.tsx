import React, { useState, useRef, useEffect } from 'react';

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

const Popover: React.FC<PopoverProps> = ({ 
  trigger, 
  children, 
  position = 'bottom-right',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'top-full left-0 mt-2';
      case 'bottom-right':
        return 'top-full right-0 mt-2';
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      default:
        return 'top-full right-0 mt-2';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute z-50 ${getPositionClasses()} min-w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg py-1 animate-fade-in`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Popover;