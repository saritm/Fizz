import React, { ChangeEvent } from "react";
import Button from "./button";

interface TextBoxProps {
  value1: string;
  onChange1: (value: string) => void;
  value2: number;
  onChange2: (value: React.SetStateAction<number>) => void; // Update the type of onChange2 prop
  onButtonClick: () => Promise<void>;
  buttonText: string;
}

const TextBox: React.FC<TextBoxProps> = ({
  value1,
  onChange1,
  value2,
  onChange2,
  onButtonClick,
  buttonText,
}) => {
  const handleChange1 = (event: ChangeEvent<HTMLInputElement>) => {
    onChange1(event.target.value);
  };

  const handleChange2 = (event: ChangeEvent<HTMLInputElement>) => {
    onChange2(Number(event.target.value)); // Parse the input value as a number
  };

  return (
    <div className="textbox-container">
      <label>Enter Transaction Title:</label>
      <input
        type="text"
        value={value1}
        onChange={handleChange1}
        className="textbox"
      />
      <label>Enter Price:</label>
      <input
        type="number" // Use type="number" for numeric input
        value={value2.toString()}
        onChange={handleChange2}
        className="textbox"
      />
      <Button onClick={onButtonClick} text={buttonText} />
    </div>
  );
};

export default TextBox;
