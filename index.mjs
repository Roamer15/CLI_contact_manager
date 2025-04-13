import inquirer from 'inquirer';
import {
  addContact,
  listContacts,
  deleteContact,
  editContact,
  searchContact,
} from './command.mjs';

async function interactiveMenu() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'Add Contact',
          'List Contacts',
          'Edit Contact',
          'Delete Contact',
          'Search Contact',
          'Exit',
        ],
      },
    ]);

    switch (action) {
      case 'Add Contact':
        await addContact();
        break;
      case 'List Contacts':
        await listContacts();
        break;
      case 'Edit Contact':
        await editContact();
        break;
      case 'Delete Contact':
        await deleteContact();
        break;
      case 'Search Contact':
        await searchContact();
        break;
      case 'Exit':
        console.log('Goodbye!');
        process.exit(0);
    }
  }
}

interactiveMenu()