/**
 * SecureGen - PGP Encryption & Decryption CLI
 *
 * 📌 Prerequisites:
 * 1. Install dependencies:
 *    npm install openpgp dotenv
 *
 * 2. Set up environment variables:
 *    - Create a `.env` file and add your Base64-encoded PGP keys:
 *      PGP_PUBLIC_KEY_BASE64=your_public_key_base64_here
 *      PGP_PRIVATE_KEY_BASE64=your_private_key_base64_here
 *
 * 🔧 Usage:
 *
 * 1️⃣ Encrypt a message:
 *    Command:
 *      node secureGen.js encrypt "Hello, Secure World!"
 *
 *    Expected Output:
 *      {
 *        "encrypted": "-----BEGIN PGP MESSAGE-----\\n\n\\nwy4ECQMIFd..."
 *      }
 *
 * 2️⃣ Decrypt a message:
 *    Command:
 *      node secureGen.js decrypt "-----BEGIN PGP MESSAGE-----\\ns\n\\nwy4ECQMIFd..."
 *
 *    Expected Output:
 *      {
 *        "decryptedData": "Hello, Secure World!"
 *      }
 *
 * 🛑 Error Handling:
 * - If PGP keys are missing in `.env`, you will see:
 *     ❌ Missing PGP keys in environment variables.
 * - If an invalid command is used:
 *     Usage:
 *       node secureGen.js encrypt "<message>"
 *       node secureGen.js decrypt "<encryptedText>"
 */


const openpgp = require("openpgp");
const dotenv = require("dotenv");

dotenv.config(); // Load .env variables

const pgpPublicKeyBase64 = process.env.PGP_PUBLIC_KEY_BASE64;
const pgpPrivateKeyBase64 = process.env.PGP_PRIVATE_KEY_BASE64;

if (!pgpPublicKeyBase64 || !pgpPrivateKeyBase64) {
  console.error("❌ Missing PGP keys in environment variables.");
  process.exit(1);
}

/**
 * Encrypt a message using a PGP public key.
 */
async function encryptMessage(message, publicKeyBase64) {
  const publicKeyArmored = Buffer.from(publicKeyBase64, "base64").toString(
    "utf8"
  );
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: message }),
    encryptionKeys: publicKey,
  });

  // Ensure the output is properly formatted with \n
  const formattedEncrypted = encrypted.replace(/\r?\n/g, "\n");

  // Log as a single line with explicit \n characters
  console.log(formattedEncrypted.replace(/\n/g, "\\n")); // Ensuring correct formatting in logs
  return { encrypted: formattedEncrypted };
}

/**
 * Decrypt an encrypted message using a PGP private key.
 */
async function decryptMessage(encryptedMessage, privateKeyBase64) {
  console.log({ rawEncryptedMessage: encryptedMessage });

  // Fix incorrectly escaped newlines in the message
  encryptedMessage = encryptedMessage.replace(/\\n/g, "\n");

  console.log({ fixedEncryptedMessage: encryptedMessage });

  // Decoding the PGP private key from base64 to UTF-8 armored format
  const privateKeyArmored = Buffer.from(privateKeyBase64, "base64").toString(
    "utf8"
  );

  // Decrypting the message using PGP private key
  const privateKey = await openpgp.readPrivateKey({
    armoredKey: privateKeyArmored,
  });

  // Decrypting the encrypted message
  const { data: decryptedData } = await openpgp.decrypt({
    message: await openpgp.readMessage({
      armoredMessage: encryptedMessage,
    }),
    decryptionKeys: privateKey,
  });

  // Trim any accidental newline at the end (if needed)
  return { decryptedData: decryptedData.trim().toString() };
}

// CLI Handling
(async () => {
  const [, , command, ...args] = process.argv;

  try {
    if (command === "encrypt" && args.length === 1) {
      console.log(await encryptMessage(args[0], pgpPublicKeyBase64));
    } else if (command === "decrypt" && args.length === 1) {
      console.log(await decryptMessage(args[0], pgpPrivateKeyBase64));
    } else {
      console.log(`
Usage:
  node secureGen.js encrypt "<message>"
  node secureGen.js decrypt "<encryptedText>"
      `);
    }
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    process.exit(1);
  }
})();

module.exports = { encryptMessage, decryptMessage };
