import sodium from "libsodium-wrappers";

export const initSodium = async () => {
    await sodium.ready;
};

export const generateUserKeys = async () => {
    await initSodium();
    const keyPair = sodium.crypto_box_keypair();
    return {
        publicKey: sodium.to_base64(keyPair.publicKey),
        privateKey: sodium.to_base64(keyPair.privateKey),
    };
};

export const encryptPrivateKey = async (privateKey: string, password: string) => {
    await sodium.ready;
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

    const key = sodium.crypto_generichash(32, sodium.from_string(password));

    const encryptedPrivateKey = sodium.crypto_secretbox_easy(
        sodium.from_string(privateKey),
        nonce,
        key
    );

    return {
        encryptedKey: sodium.to_base64(encryptedPrivateKey),
        nonce: sodium.to_base64(nonce),
    };
};


export const decryptPrivateKey = async (encryptedKey: string, password: string, nonce: string) => {
    await sodium.ready;

    const key = sodium.crypto_generichash(32, sodium.from_string(password));

    const decryptedPrivateKey = sodium.crypto_secretbox_open_easy(
        sodium.from_base64(encryptedKey),
        sodium.from_base64(nonce),
        key
    );

    return sodium.to_string(decryptedPrivateKey);
};

export const encryptPrivateMessage = async (
    message: string,
    receiverPublicKey: string,
    senderPrivateKey: string
) => {
    await initSodium();

    const sharedKey = sodium.crypto_box_beforenm(
        sodium.from_base64(receiverPublicKey),
        sodium.from_base64(senderPrivateKey)
    );

    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

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
    otherPartyPublicKey: string,
    myPrivateKey: string
) => {
    await initSodium();

    const sharedKey = sodium.crypto_box_beforenm(
        sodium.from_base64(otherPartyPublicKey),
        sodium.from_base64(myPrivateKey)
    );

    const decryptedMessage = sodium.crypto_box_open_easy_afternm(
        sodium.from_base64(encryptedMessage),
        sodium.from_base64(nonce),
        sharedKey
    );

    return sodium.to_string(decryptedMessage);
};