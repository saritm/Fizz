import mysql from 'mysql';

class CustomerManager {
  private connection: mysql.Connection;

  constructor(config: mysql.ConnectionConfig) {
    this.connection = mysql.createConnection(config);
  }

  public insertCustomer(customer: Customer): Promise<number> {
    return new Promise((resolve, reject) => {
      const insertQuery = 'INSERT INTO Customer SET ?';

      this.connection.query(insertQuery, customer, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  public updateSpendingLimit(customerId: number, newSpendingLimit: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const updateQuery = `UPDATE Customer SET spending_limit = ${newSpendingLimit} WHERE id = ${customerId}`;

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

// Define the Customer class
class Customer {
  public spending_limit: number;

  constructor(spendingLimit: number) {
    this.spending_limit = spendingLimit;
  }
}

// Create a CustomerManager instance
const customerManager = new CustomerManager({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
});

// Define a new customer
const newCustomer = new Customer(100.0);

// Insert the customer into the table
customerManager
  .insertCustomer(newCustomer)
  .then(insertedId => {
    console.log('New customer inserted successfully!');
    console.log('Inserted customer ID:', insertedId);

    // Update the spending limit for the inserted customer
    const newSpendingLimit = 150.0;
    return customerManager.updateSpendingLimit(insertedId, newSpendingLimit);
  })
  .then(affectedRows => {
    console.log('Spending limit updated successfully!');
    console.log('Affected rows:', affectedRows);

    // Close the MySQL connection
    customerManager.closeConnection();
  })
  .catch(error => {
    console.error('Error:', error);

    // Close the MySQL connection in case of an error
    customerManager.closeConnection();
  });
