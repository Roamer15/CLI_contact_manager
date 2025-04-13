// import chalk from "chalk";
// import { Command } from "commander";
// import pool from "./db.mjs";
// import readline from "readline";

// function askQuestion(query) {
//   const r1 = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   return new Promise((resolve) =>
//     r1.question(query, (ans) => {
//       r1.close();
//       resolve(ans);
//     })
//   );
// }

// function askUpdateQuestion(query, defaultValue = "") {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   return new Promise((resolve) => {
//     rl.question(`${query} (${defaultValue}): `, (answer) => {
//       rl.close();
//       resolve(answer.trim() || defaultValue);
//     });
//   });
// }

// const program = new Command();

// // Function to add contacts
// // Ask the user for name, email, phone, address using ecommander
// // Connect to the database
// // Insert the information to the conatct table
// // Display a success message to indicate successful addition of contact

// program
//   .name("contact-manager")
//   .description("CLI to manage contacts")
//   .version("1.0.0");
// program
//   .command("add")
//   .description("Add a new contact")
//   .action(async (options) => {
//     try {
//       const name = await askQuestion(chalk.yellow("Enter name: "));
//       const email = await askQuestion(chalk.yellow("Enter email: "));
//       const phone = await askQuestion(chalk.yellow("Enter phone: "));
//       const address = await askQuestion(chalk.yellow("Enter address: "));

//       console.log(chalk.blue("\nContact info:", name, email, phone, address));
//       const query = `INSERT INTO CONTACTS(Name, Email, Phone, Address) VALUES ($1,$2,$3,$4)`;
//       const values = [name, email, phone, address];
//       await pool.query(query, values);
//       console.log(chalk.green("Contact added successfully"));
//     } catch (err) {
//       console.error(chalk.red("Error adding contact:"), err.message);
//     }
//   });

// // Function to delete contacts
// // Ask the user for name of contact to be deleted
// // Connect to the database
// // delete the contact information in the contact table
// // Display a success message to indicate successful addition of contact

// program
//   .command("delete")
//   .description("Delete an existing contact")
//   //   .option("--name <name>", "Name of contact to be deleted")
//   .action(async () => {
//     try {
//       const name = await askQuestion(
//         chalk.yellow("Enter name of contact you wish to delete: ")
//       );
//       console.log("Deleting contact:", name);
//       const res = await pool.query("DELETE FROM Contacts WHERE name=$1", [
//         name,
//       ]);
//       console.log(
//         res.rowCount > 0
//           ? chalk.green("Contact deleted successfully")
//           : chalk.yellow("No contact with such name")
//       );
//     } catch (err) {
//       console.error(chalk.red("Error deleting contact:", err.message));
//     }
//   });

// // Function to List contacts
// // Connect to the contact table and display all the info in the table

// program
//   .command("list")
//   .description("List all existing contact")
//   .action(async () => {
//     try {
//       const res = await pool.query("SELECT * FROM Contacts");
//       console.table(res.rows);
//     } catch (err) {
//       console.error("Error fetching contacts:", err.message);
//     }
//   });

// // Function to Update contacts
// // Ask user the name of contact he/she wants to modify
// // Present all the contact fields of the matching contact one at a time permitting the user to edit them as he wishes

// program
//   .command("update")
//   .description("Update a contact by name")
//   .action(async () => {
//     try {
//       const targetName = await askUpdateQuestion(
//         "Enter the name of the contact to update"
//       );

//       const { rows } = await pool.query(
//         "SELECT * FROM contacts WHERE name = $1",
//         [targetName]
//       );
//       if (rows.length === 0) {
//         console.log(chalk.red("Contact not found."));
//         return;
//       }

//       const current = rows[0];

//       const name = await askQuestion("Enter new name", current.name);
//       const email = await askQuestion("Enter new email", current.email);
//       const phone = await askQuestion("Enter new phone", current.phone);
//       const address = await askQuestion("Enter new address", current.address);

//       await pool.query(
//         `UPDATE contacts SET name=$1, email=$2, phone=$3, address=$4 WHERE name=$5`,
//         [name, email, phone, address, targetName]
//       );

//       console.log(chalk.green("Contact updated successfully!"));
//     } catch (err) {
//       console.error(chalk.red("Error updating contact:"), err.message);
//     }
//   });

// // Function to search
// // Ask User 

// program
//   .command("search")
//   .description("Search for a contact by name")
//   .action(async () => {
//     try {
//       const field = await askQuestion("Search by (name/email/phone): ");
//       const term = await askQuestion(`Enter ${field}: `);
//       const query = `SELECT * FROM contacts WHERE LOWER(${field}) LIKE LOWER($1)`;
//       const values = [`%${term}%`]; // Allows partial matches

//       const { rows } = await pool.query(query, values);

//       if (rows.length === 0) {
//         console.log(chalk.red("No matching contacts found."));
//       } else {
//         console.log(chalk.blue(`Found ${rows.length} contact(s):`));
//         console.table(rows);
//       }
//     } catch (err) {
//       console.error(chalk.red("Error searching contacts:"), err.message);
//     }
//   });

// program.parse();


import chalk from "chalk";
import pool from "./db.mjs";
import readline from "readline";
import inquirer from 'inquirer';

// Helper functions
export function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

export function askUpdateQuestion(query, defaultValue = "") {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${query} (${defaultValue}): `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}



// Function to add contacts
// Ask the user for name, email, phone, address using ecommander
// Connect to the database
// Insert the information to the conatct table
// Display a success message to indicate successful addition of contact

export async function addContact() {
    try {
      const name = await askQuestion(chalk.yellow("Enter name: "));
      const email = await askQuestion(chalk.yellow("Enter email: "));
      const phone = await askQuestion(chalk.yellow("Enter phone: "));
      const address = await askQuestion(chalk.yellow("Enter address: "));
  
      const groupChoices = ['Friends', 'Family', 'Work', 'School', 'Other'];
  
      const { group } = await inquirer.prompt([
        {
          type: 'list',
          name: 'group',
          message: 'Select a group for this contact:',
          choices: groupChoices,
        },
      ]);
  
      console.log(chalk.blue("\nContact info:", name, email, phone, address, group));
  
      const query = `
        INSERT INTO CONTACTS(Name, Email, Phone, Address, Group_Name)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const values = [name, email, phone, address, group];
  
      await pool.query(query, values);
      console.log(chalk.green("✅ Contact added successfully!"));
    } catch (err) {
      console.error(chalk.red("Error adding contact:"), err.message);
    }
  }
  
// Function to delete contacts
// Ask the user for name of contact to be deleted
// Connect to the database
// delete the contact information in the contact table
// Display a success message to indicate successful addition of contact

export async function deleteContact() {
  try {
    const name = await askQuestion(
      chalk.yellow("Enter name of contact you wish to delete: ")
    );
    const res = await pool.query("DELETE FROM Contacts WHERE name=$1", [name]);
    console.log(
      res.rowCount > 0
        ? chalk.green("Contact deleted successfully")
        : chalk.yellow("No contact with such name")
    );
  } catch (err) {
    console.error(chalk.red("Error deleting contact:"), err.message);
  }
}

// Function to List contacts
// Connect to the contact table and display all the info in the table

export async function listContacts() {
  try {
    const res = await pool.query("SELECT * FROM Contacts");
    console.table(res.rows);
  } catch (err) {
    console.error(chalk.red("Error fetching contacts:"), err.message);
  }
}


// Function to Update contacts
// Ask user the name of contact he/she wants to modify
// Present all the contact fields of the matching contact one at a time permitting the user to edit them as he wishes
export async function editContact() {
  try {
    const targetName = await askUpdateQuestion(
      "Enter the name of the contact to update"
    );

    const { rows } = await pool.query(
      "SELECT * FROM contacts WHERE name = $1",
      [targetName]
    );
    if (rows.length === 0) {
      console.log(chalk.red("Contact not found."));
      return;
    }

    const current = rows[0];

    const name = await askUpdateQuestion("Enter new name", current.name);
    const email = await askUpdateQuestion("Enter new email", current.email);
    const phone = await askUpdateQuestion("Enter new phone", current.phone);
    const address = await askUpdateQuestion("Enter new address", current.address);

    await pool.query(
      `UPDATE contacts SET name=$1, email=$2, phone=$3, address=$4 WHERE name=$5`,
      [name, email, phone, address, targetName]
    );

    console.log(chalk.green("Contact updated successfully!"));
  } catch (err) {
    console.error(chalk.red("Error updating contact:"), err.message);
  }
}

export async function searchContact() {
  try {
    const field = await askQuestion("Search by (name/email/phone): ");
    const term = await askQuestion(`Enter ${field}: `);
    const query = `SELECT * FROM contacts WHERE LOWER(${field}) LIKE LOWER($1)`;
    const values = [`%${term}%`];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      console.log(chalk.red("No matching contacts found."));
    } else {
      console.log(chalk.blue(`Found ${rows.length} contact(s):`));
      console.table(rows);
    }
  } catch (err) {
    console.error(chalk.red("Error searching contacts:"), err.message);
  }
}
