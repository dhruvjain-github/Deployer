import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button2: React.FC<ButtonProps> = ({ children, onClick, disabled, className }) => {
  return (
    <StyledWrapper>
      <button className={`btn ${className}`} onClick={onClick} disabled={disabled}>
        <svg height={24} width={24} fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
          <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
        </svg>
        <span className="text">{children}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .btn {
    border: none;
    width: 25em;
    height: 3em;
    border-radius: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    background: linear-gradient(90deg, #E0E0E0, #C0C0C0);
    cursor: pointer;
    transition: all 300ms ease-in-out;
    box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
      inset 0px -2px 0px 0px rgba(0, 0, 0, 0.2),
      0px 0px 1px rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;
  }

  /* Gradient Text */
  .text {
    font-weight: 600;
    font-size: medium;
    background: linear-gradient(90deg, #4F9DFF, #007BFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 1000ms ease-in-out;
  }

  .sparkle {
    fill: #4F9DFF;
    transition: all 1000ms ease;
  }

  /* Hover Effects */
  .btn:hover {
    background: linear-gradient(0deg, #4F9DFF, #007BFF);
    box-shadow: 0px 0px 6px rgba(192, 192, 192, 0.6);
    transform: translateY(-1px);
  }

  .btn:hover .text {
    -webkit-text-fill-color: white; /* Text turns white */
  }

  .btn:hover .sparkle {
    fill: white;
    transform: scale(1.1);
  }
`;




export default Button2;
