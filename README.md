```markdown
# Node.js CLI Contact Manager

A simple Command Line Interface (CLI) application to manage contacts using Node.js and PostgreSQL.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [1. Clone the repostory](#1-clone-the-repository)
  - [2. Set Up PostgreSQL Database](#2-set-up-postgresql-database)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Add a new contact
- List all contacts
- Delete a contact
- Interactive CLI using `yargs`

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your machine.
2. **PostgreSQL**: Ensure you have PostgreSQL installed and running.
3. **npm**: Node package manager, which comes with Node.js.

## Setup

### 1. Set Up the Project

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/yourusername/contact-manager.git
   cd contact-manager
   ```

2. **Install Required Packages**:
   ```sh
   npm install pg yargs
   ```

   - `pg`: PostgreSQL client for Node.js (https://github.com/brianc/node-postgres).
   - `yargs`: A library to create interactive command line prompts (https://yargs.js.org/).
   - `chalk`: A library to make text in terminal more colorful (https://github.com/chalk/chalk#readme)

### 2. Set Up PostgreSQL Database

1. **Create a Database and User**:
   ```sh
   psql -U postgres
   ```

   Inside the PostgreSQL shell, run:
   ```sql
   CREATE DATABASE contact_manager;
   CREATE USER contact_manager_user WITH ENCRYPTED PASSWORD 'yourpassword';
   GRANT ALL PRIVILEGES ON DATABASE contact_manager TO contact_manager_user;
   \q
   ```

2. **Create a Table for Contacts**:
   ```sh
   psql -U contact_manager_user -d contact_manager
   ```

   Inside the PostgreSQL shell, run:
   ```sql
   CREATE TABLE contacts (
       Name VARCHAR(50) NOT NULL,
       Email VARCHAR(150) UNIQUE NOT NULL,
       Phone VARCHAR(15) PRIMARY KEY UNIQUE NOT NULL,
       Address TEXT
   );
   \q
   ```

## Usage

1. **Start the Application**:
   ```sh
   npm start
   ```

2. **Interact with the CLI**:
   - Choose the action you want to perform (Add Contact, List Contacts, Delete Contact, Exit).

## Contributing

Contributions are welcome! Please open an issue or a pull request if you have any improvements or bug fixes.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Additional Files

You might also want to include a `LICENSE` file for the MIT License:

```plaintext
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

`Beleke Ian` `April 2025`
