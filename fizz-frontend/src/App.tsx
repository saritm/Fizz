import React, { useState } from 'react';
import TextBox from './Components/textbox';

const App: React.FC = () => {

  const [text1, setText1] = useState('');
  const [number, setNumber] = useState<number | string>('');

  const handleTextChange = (value: string) => {
    setText1(value);
  };

  const handleNumberChange = (value: number | string) => {
    setNumber(value);
  };

  const handleSubmit = () => {
    alert(`Text entered: ${text1} ${number}`);
  };

  return (
    <div>
      <TextBox value1={text1} onChange1={handleTextChange} value2 = {number}  onChange2={handleNumberChange} onSubmit={handleSubmit} />
    </div>
  );
};

export default App;
