import React, { ChangeEvent, useState} from 'react';
import Button from './button';
import './textbox.css'

interface TextBoxProps {
  value1: string;
  onChange1: (value: string) => void;
  value2: number | string;
  onChange2: (value: number | string) => void;
  
}

const TextBox: React.FC<TextBoxProps> = ({ value1, onChange1, value2, onChange2, onSubmit }) => {
  const handleChange1 = (event: ChangeEvent<HTMLInputElement>) => {
    onChange1(event.target.value);
  };

const [error, setError] = useState('');
  
  const handleButtonClick = () => {
    
    if (typeof(value2) != number) {
      setError('Error message');
    } else {
      setError('');
      // Continue with the desired action
    }
  };

  const handleChange2 = (event: ChangeEvent<HTMLInputElement>) => {
    onChange2(event.target.value);
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    marginRight: '5px'
  };

  const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
  };

  return (
    <div className="textbox-container">
      <label style={labelStyle}> Enter Transaction Title: </label>
      <input type="text" value={value1} onChange={handleChange1} className="textbox" />
      <label style={labelStyle}> Enter Price: </label>
      <input type="text" value={value2.toString()} onChange={handleChange2} className="textbox"/>
      {error && <div style={errorStyle}>{error}</div>}
      <Button onClick={handleButtonClick} text="Simulate Purchase" />
    </div>
  );
};

export default TextBox;
