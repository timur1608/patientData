const IPFS = require('ipfs-http-client');
const ipfs = IPFS.create({ host: 'localhost', port: '5001', protocol: 'http' });
const fs = require('fs');

const addData = async (data) => {
    const { path } = await ipfs.add(data);
    return path;
};

const getData = async (cid) => {
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString();
};

const uploadImageToIPFS = async (filePath) => {
    const file = fs.readFileSync(filePath);
    const { path } = await ipfs.add(file);
    console.log('IPFS Hash (CID):', path);
    return path;
}

const fetchImageFromIPFS = async (cid, outputPath) => {
    const stream = ipfs.cat(cid);
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);
    fs.writeFileSync(outputPath, fileBuffer);
    console.log('Image saved to', outputPath);
}

module.exports = { addData, getData, uploadImageToIPFS, fetchImageFromIPFS };
