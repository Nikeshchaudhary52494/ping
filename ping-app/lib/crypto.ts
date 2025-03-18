import sodium from "libsodium-wrappers";

// Initialize libsodium
export const initSodium = async () => {
    await sodium.ready;
};

// Generate User Key Pair
export const generateUserKeys = async () => {
    await initSodium();
    const keyPair = sodium.crypto_box_keypair();
    return {
        publicKey: sodium.to_base64(keyPair.publicKey), // Shareable
        privateKey: sodium.to_base64(keyPair.privateKey), // Keep Secret
    };
};

// Generate Group Key (AES-256)
export const generateGroupKey = async () => {
    await initSodium();
    return sodium.to_base64(sodium.randombytes_buf(32));
};

// Encrypt Group Key for a User
export const encryptGroupKey = async (groupKey: string, userPublicKey: string, adminPrivateKey: string) => {
    await initSodium();
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const encryptedKey = sodium.crypto_box_easy(
        sodium.from_base64(groupKey),
        nonce,
        sodium.from_base64(userPublicKey),
        sodium.from_base64(adminPrivateKey)
    );
    return {
        encryptedKey: sodium.to_base64(encryptedKey),
        nonce: sodium.to_base64(nonce),
    };
};

// Decrypt Group Key
export const decryptGroupKey = async (encryptedKey: string, nonce: string, userPrivateKey: string, adminPublicKey: string) => {
    await initSodium();
    const decryptedKey = sodium.crypto_box_open_easy(
        sodium.from_base64(encryptedKey),
        sodium.from_base64(nonce),
        sodium.from_base64(adminPublicKey),
        sodium.from_base64(userPrivateKey)
    );
    return sodium.to_base64(decryptedKey);
};

// Encrypt Message using Group Key
export const encryptGroupMessage = async (message: string, groupKey: string) => {
    await initSodium();
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    const encryptedMessage = sodium.crypto_secretbox_easy(
        sodium.from_string(message),
        nonce,
        sodium.from_base64(groupKey)
    );
    return {
        encryptedMessage: sodium.to_base64(encryptedMessage),
        nonce: sodium.to_base64(nonce),
    };
};

// Decrypt Message using Group Key
export const decrypGrouptMessage = async (encryptedMessage: string, nonce: string, groupKey: string) => {
    await initSodium();
    const decryptedMessage = sodium.crypto_secretbox_open_easy(
        sodium.from_base64(encryptedMessage),
        sodium.from_base64(nonce),
        sodium.from_base64(groupKey)
    );
    return sodium.to_string(decryptedMessage);
};

export const encryptPrivateMessage = async (
    message: string,
    receiverPublicKey: string,
    senderPrivateKey: string
) => {
    await initSodium();

    // Generate shared secret key
    const sharedKey = sodium.crypto_box_beforenm(
        sodium.from_base64(receiverPublicKey), // Receiver's public key
        sodium.from_base64(senderPrivateKey)  // Sender's private key
    );

    // Generate a random nonce
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

    // Encrypt using shared key and crypto_box_easy_afternm
    const encryptedMessage = sodium.crypto_box_easy_afternm(
        sodium.from_string(message),
        nonce,
        sharedKey
    );

    return {
        encryptedMessage: sodium.to_base64(encryptedMessage),
        nonce: sodium.to_base64(nonce),
    };
};

export const decryptPrivateMessage = async (
    encryptedMessage: string,
    nonce: string,
    otherPartyPublicKey: string, // Public key of the other party (sender or receiver)
    myPrivateKey: string         // Private key of the current user (sender or receiver)
) => {
    await initSodium();

    // Generate the shared secret key
    const sharedKey = sodium.crypto_box_beforenm(
        sodium.from_base64(otherPartyPublicKey), // Other party's public key
        sodium.from_base64(myPrivateKey)        // Current user's private key
    );

    // Decrypt the message
    const decryptedMessage = sodium.crypto_box_open_easy_afternm(
        sodium.from_base64(encryptedMessage),
        sodium.from_base64(nonce),
        sharedKey
    );

    return sodium.to_string(decryptedMessage);
};