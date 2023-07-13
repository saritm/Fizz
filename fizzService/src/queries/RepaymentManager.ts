import mysql from 'mysql';

class RepaymentManager {
  private connection: mysql.Connection;

  constructor(config: mysql.ConnectionConfig) {
    this.connection = mysql.createConnection(config);
  }

  public insertRepayment(repayment: Repayment): Promise<number> {
    return new Promise((resolve, reject) => {
      const insertQuery = 'INSERT INTO Repayment SET ?';

      this.connection.query(insertQuery, repayment, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  public updateNumTransactions(repaymentId: number, newNumTransactions: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const updateQuery = `UPDATE Repayment SET num_transactions = ${newNumTransactions} WHERE id = ${repaymentId}`;

      this.connection.query(updateQuery, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  }

  public closeConnection(): void {
    this.connection.end();
  }
}

// Example usage:

// Define the Repayment class
class Repayment {
  public direction: string;
  public amount: number;
  public num_transactions: number;

  constructor(direction: string, amount: number, numTransactions: number) {
    this.direction = direction;
    this.amount = amount;
    this.num_transactions = numTransactions;
  }
}

// Create a RepaymentManager instance
const repaymentManager = new RepaymentManager({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
});

// Define a new repayment
const newRepayment = new Repayment('userToFizz', 10.99, 5);

// Insert the repayment into the table
repaymentManager
  .insertRepayment(newRepayment)
  .then(insertedId => {
    console.log('New repayment inserted successfully!');
    console.log('Inserted repayment ID:', insertedId);

    // Update the number of transactions for the inserted repayment
    const newNumTransactions = 7;
    return repaymentManager.updateNumTransactions(insertedId, newNumTransactions);
  })
  .then(affectedRows => {
    console.log('Number of transactions updated successfully!');
    console.log('Affected rows:', affectedRows);

    // Close the MySQL connection
    repaymentManager.closeConnection();
  })
  .catch(error => {
    console.error('Error:', error);

    // Close the MySQL connection in case of an error
    repaymentManager.closeConnection();
  });
