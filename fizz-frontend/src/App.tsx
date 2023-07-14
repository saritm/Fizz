import React, { useState } from "react";
import TextBox from "./Components/textbox";
import TransactionTable from "./Components/transactionTable";
import RepaymentTable from "./Components/repaymentTable";

const App: React.FC = () => {
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState(0);
  const [transactions, setTransactions] = useState<Array<Transaction>>([]);
  const [transactionsFetched, setTransactionsFetched] = useState(false);
  const [isRepaymentButtonClicked, setRepaymentButtonClicked] = useState(false);

  const handleButtonClick = async () => {
    setRepaymentButtonClicked(false);
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

  const handleTransactionButtonClick = () => {
    const fetchTransactions = async () => {
      const response = await fetch(
        "http://localhost:3000/api/transaction/history"
      );
      const body = await response.json();
      setTransactions(body["transactions"]);
      setTransactionsFetched(true);
    };

    fetchTransactions();
  };

  const handleRepaymentButtonClick = () => {
    setRepaymentButtonClicked(true);
  };

  return (
    <div className="app-container">
      <h1 className="app-heading">My App </h1>
      {purchaseSuccess ? (
        <div className="purchase-success">Purchase successful!</div>
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

      <button className="button" onClick={handleTransactionButtonClick}>
        Get Transaction History
      </button>
      <button className="button" onClick={handleButtonClick}>
        Get Repayment History
      </button>
      {transactionsFetched && <TransactionTable transactions={transactions} />}
      {isRepaymentButtonClicked && <RepaymentTable />}
    </div>
  );
};

export default App;
