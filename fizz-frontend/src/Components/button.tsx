import React from 'react';
import './textbox.css';

interface ButtonProps {
  onClick: () => void;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <div className="textbox-container">
      <button onClick={onClick}>{text}</button>
    </div>
    
  );
};

export default Button;
