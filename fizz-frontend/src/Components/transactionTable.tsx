import React from "react";

interface TableProps {
  transactions: Array<Transaction>;
}

const TransactionTable: React.FC<TableProps> = ({ transactions }) => {
  return (
    <div>
      <h2>Transactions</h2>
      <table className={"table table-striped"}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Price</th>
            <th>Refunded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.transaction_title}</td>
              <td>{transaction.transaction_type}</td>
              <td>${transaction.price}</td>
              <td>{transaction.refunded ? "Yes" : "No"}</td>
              <td>
                {!transaction.refunded && (
                  <button onClick={() => handleRefund(transaction.id)}>
                    Refund
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
