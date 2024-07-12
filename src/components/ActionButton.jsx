import { DotsThreeVertical } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import React from 'react';

const ActionButton = ({ isOpen, toggle, label, children }) => {
  const buttonRef = useRef(null);
  const [buttonStyles, setButtonStyles] = useState({});

  useEffect(() => {
    const setInitialPosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonStyles({
          position: 'fixed',
          zIndex: 200,
          left: rect.left - 170 + 'px',
          top: rect.bottom + 'px',
        });
      }
    };

    setInitialPosition();

    const handleScroll = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonStyles({
          position: 'fixed',
          zIndex: 200,
          left: rect.left - 170 + 'px',
          top: rect.bottom + 'px',
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleButtonClick = () => {
    toggle();
  };

  return (
    <div className="relative inline-block text-left" ref={buttonRef}>
      <button
        onClick={() => toggle()}
        className="w-[48px] h-[48px] cursor-pointer focus:outline-none"
      >
        <DotsThreeVertical size={32} set="bold" color="#DC362E" />
      </button>
      {isOpen && (
        <div
          className="-z-50"
          style={{
            ...buttonStyles,
            width: '211px',
            borderRadius: '10px',
            boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.20)',
            backgroundColor: 'white',
            border: '1px solid #E9E9E9',
          }}
        >
          <div className="py-1 px-5 text-[#BBBBBB] font-semibold text-[12px] mx-1 mt-2">
            {label}
          </div>
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex="-1"
          >
            {React.Children.map(children, (child) => {
              return React.cloneElement(child, {
                onClick: handleButtonClick,
              });
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButton;
