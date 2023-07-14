import React from "react";

interface ButtonProps {
  onClick: () => Promise<void>;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  const handleClick = async () => {
    try {
      await onClick();
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle any errors from the request or response
    }
  };

  return (
    <div className="button-container">
      <button onClick={handleClick}>{text}</button>
    </div>
  );
};

export default Button;
