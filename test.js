// testEncryptDecrypt.js
const { encrypt, decrypt, encryptImage, decryptImage } = require('./encryptor/encryptor'); // Убедись, что путь правильный

const testEncryptionDecryption = () => {
    const testData = "No history";
    console.log(`Original data: ${testData}`);

    // Шифрование данных
    const encryptedData = encrypt(testData);
    console.log(`Encrypted data: ${encryptedData}`);

    // Дешифрование данных
    const decryptedData = decrypt(encryptedData);
    console.log(`Decrypted data: ${decryptedData}`);

    // Проверка корректности дешифрования
    if (decryptedData === testData) {
        console.log("Encryption and decryption are working correctly.");
    } else {
        console.log("There is an issue with encryption or decryption.");
    }
};

// Запуск проверки
testEncryptionDecryption();
