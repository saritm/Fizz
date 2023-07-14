import React, { useEffect, useState } from "react";

interface Repayment {
  direction: "userToFizz" | "fizzToUser";
  amount: number;
  num_transactions: number;
}

const RepaymentTable: React.FC = () => {
  const [repayments, setRepayments] = useState<Repayment[]>([]);

  useEffect(() => {
    const fetchRepayments = async () => {
      try {
        const response = await fetch("http://localhost:3000/repayment");
        const data = await response.json();
        setRepayments(data);
      } catch (error) {
        console.error("Error fetching repayment history:", error);
      }
    };

    fetchRepayments();
  }, []);

  return (
    <div>
      <h2>Repayment History</h2>
      <table>
        <thead>
          <tr>
            <th>Direction</th>
            <th>Amount</th>
            <th>Number of Transactions</th>
          </tr>
        </thead>
        <tbody>
          {repayments.map((repayment, index) => (
            <tr key={index}>
              <td>{repayment.direction}</td>
              <td>{repayment.amount}</td>
              <td>{repayment.num_transactions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RepaymentTable;
