# SecureGen

SecureGen is a simple command-line tool for encrypting and decrypting messages using PGP keys. It utilizes OpenPGP.js to provide secure encryption and decryption functionality.

## Features
- Encrypt messages using a PGP public key
- Decrypt messages using a PGP private key
- Secure key storage using `.env`

## Installation

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your system.

### Clone the Repository
```sh
git clone <your-repo-url>
cd secureGen
```

### Install Dependencies
```sh
npm install
```

## Configuration

### Environment Variables
Create a `.env` file in the `secureGen` directory and define any necessary environment variables.

### PGP Key Configuration
Create a `config.json` file inside the `secureGen` directory with the following structure:
```json
{
  "pgpPublicKeyBase64": "<Your Base64-encoded Public Key>",
  "pgpPrivateKeyBase64": "<Your Base64-encoded Private Key>"
}
```

## Usage

### Encrypt a Message
```sh
node securegen.js encrypt "Your message here"
```

### Decrypt a Message
```sh
node securegen.js decrypt "<PGP Encrypted Message>"
```

## Project Structure
```
secureGen/
│── .env
│── securegen.js
│── .gitignore
│── package.json
│── package-lock.json
│── README.md
│── node_modules/
```

## Dependencies
The following dependencies are required for SecureGen:
```sh
npm install openpgp dotenv fs
```

## License
This project is licensed under the MIT License.

## Contributing
Feel free to fork this project and submit pull requests!

