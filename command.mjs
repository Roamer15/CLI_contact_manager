import chalk from "chalk";
import pool from "./db.mjs";
import readline from "readline";
import inquirer from 'inquirer';

import * as yup from 'yup';

const nameSchema = yup.string().required("Name is required").max(20, "Name must be less than 20 characters");

const emailSchema = yup
  .string()
  .email("Invalid email format. Email must be of format example@mail.com")
  .optional();

const phoneSchema = yup
  .string()
  .matches(/^[0-9]{8,15}$/, "Phone must be 8–15 digits")
  .required("Phone is required");

const addressSchema = yup.string().optional();

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
    rl.question(`${query} (${defaultValue}) `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

// This function performs a type check on the user's input based on what data is entered per field
async function getValidatedInput(promptText, schema) {
  while (true) {
    const input = await askQuestion(chalk.yellow(promptText));
    try {
      const validated = await schema.validate(input);
      return validated;
    } catch (err) {
      console.log(chalk.red("❌ " + err.message));
    }
  }
}

// This function performs a type check on the user's input based on what data is entered per field for the edit function
async function getValidatedInputForEdit(promptText, schema, defaultValue) {
  while (true) {
    const input = await askUpdateQuestion(chalk.yellow(promptText), defaultValue);
    try {
      const validated = await schema.validate(input);
      return validated;
    } catch (err) {
      console.log(chalk.red("❌ " + err.message));
    }
  }
}


// Function to add contacts
// Ask the user for name, email, phone, address using ecommander
// Connect to the database
// Insert the information to the conatct table
// Display a success message to indicate successful addition of contact

export async function addContact() {
    try {
      const name = await getValidatedInput("Enter name: ", nameSchema);
      const email = await getValidatedInput("Enter email: ", emailSchema);
      const phone = await getValidatedInput("Enter phone: ", phoneSchema);
      const address = await getValidatedInput("Enter address (optional): ", addressSchema);
  
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
      chalk.yellow("Enter the name of the contact you want to delete: ")
    );

    const res = await pool.query("SELECT * FROM Contacts WHERE name = $1", [name]);

    if (res.rows.length === 0) {
      console.log(chalk.red("No contact found with that name."));
      return;
    }

    if (res.rows.length === 1) {
      const confirm = await askQuestion(
        chalk.cyan(`Do you want to delete ${res.rows[0].name} (${res.rows[0].email})? (yes/no): `)
      );

      if (confirm.toLowerCase() === "yes") {
        await pool.query("DELETE FROM Contacts WHERE name = $1 AND email = $2", [
          res.rows[0].name,
          res.rows[0].email,
        ]);
        console.log(chalk.green("Contact deleted successfully."));
      } else {
        console.log(chalk.yellow("Deletion cancelled."));
      }
      return;
    }

    // Multiple contacts found — ask user to choose
    console.log(chalk.yellow("Multiple contacts found:"));
    res.rows.forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.name} - ${contact.email} - ${contact.phone}`);
    });

    const indexToDelete = await askQuestion(
      chalk.yellow("Enter the number of the contact you want to delete: ")
    );

    const selected = res.rows[parseInt(indexToDelete) - 1];

    if (!selected) {
      console.log(chalk.red("Invalid selection."));
      return;
    }

    await pool.query(
      "DELETE FROM Contacts WHERE name = $1 AND email = $2 AND phone = $3",
      [selected.name, selected.email, selected.phone]
    );

    console.log(chalk.green("Contact deleted successfully."));
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

    const name = await getValidatedInputForEdit("Enter name: ", nameSchema, current.name);
      const email = await getValidatedInputForEdit("Enter email: ", emailSchema, current.email);
      const phone = await getValidatedInputForEdit("Enter phone: ", phoneSchema, current.phone);
      const address = await getValidatedInputForEdit("Enter address (optional): ", addressSchema, current.address);
  
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
