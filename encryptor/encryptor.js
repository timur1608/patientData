const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();


const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY;

function encryptImage(imagePath, iv) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        console.log('Image Buffer:', imageBuffer);


        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let encrypted = cipher.update(imageBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        console.log('Encrypted Buffer:', encrypted);

        return encrypted.toString('hex');
    } catch (error) {
        console.error('Error encrypting image:', error);
        return null; // Возвращаем null в случае ошибки
    }
}

function decryptImage(encryptedImagePath, iv) {
    const encryptedData = fs.readFileSync(encryptedImagePath);
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
}

const encrypt = (data) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

const decrypt = (data) => {
    const [ivHex, encrypted] = data.split(':');
    const ivBuffer = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), ivBuffer);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = { encrypt, decrypt, encryptImage, decryptImage };
