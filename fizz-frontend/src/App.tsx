import React, { useState } from "react";
import TextBox from "./Components/textbox";

const App: React.FC = () => {
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState(0);

  const handleButtonClick = async () => {
    console.log(value1, value2);
    try {
      // Make the POST request here using value1 and value2
      await fetch("http://localhost:3000/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_type: "PURCHASE",
          transaction_title: value1,
          price: value2,
        }),
      });

      // Set the purchase success state to true
      setPurchaseSuccess(true);
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle any network or fetch-related errors
    }
  };

  return (
    <div className="app-container">
      <h1>My App</h1>
      {purchaseSuccess ? (
        <div>Purchase successful!</div>
      ) : (
        <TextBox
          value1={value1}
          onChange1={setValue1}
          value2={value2}
          onChange2={setValue2}
          onButtonClick={handleButtonClick}
          buttonText="Simulate Purchase"
        />
      )}
    </div>
  );
};

export default App;
