const { create } = require('ipfs-http-client');
const Web3 = require('web3');
const { encrypt, decrypt, encryptImage, decryptImage } = require('../encryptor/encryptor'); // Убедись, что путь правильный
const contract = require('@truffle/contract');
const PatientRecordsArtifact = require('../build/contracts/PatientRecords.json');
const { addData, getData, uploadImageToIPFS, fetchImageFromIPFS } = require('../ipfs/ipfsClient');

const ipfs = create('http://localhost:5001'); // IPFS API endpoint
const web3 = new Web3('http://127.0.0.1:8545'); // Ganache endpoint

const PatientRecords = contract(PatientRecordsArtifact);
PatientRecords.setProvider(web3.currentProvider);

const interactWithContract = async (patientAddress, patientName, cardNumber, ipfsHash, ipfsHashImage) => {
    const accounts = await web3.eth.getAccounts();
    const instance = await PatientRecords.deployed();

    await instance.addPatient(patientAddress, patientName, cardNumber, ipfsHash, ipfsHashImage, { from: accounts[0] });
    const patient = await instance.getPatient(patientAddress);
    console.log('Stored Patient in contract:', patient);
};

const main = async () => {
    const data = [
        {'0': '0x1Cb107cCE975d8c1a0Fb1a2b0E42300c629fa67e', '1': 'John Doe', '2': '123456789', '3': 'F02.2 Болезнь Пика',
         '4': './images/mrt1.jpg'},
        {'0': '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', '1': 'Mike Mishel', '2': '28851', '3': 'M42.1 Остеохондроз',
         '4': './images/mrt2.jpg'},
        {'0': '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', '1': 'Peter Denic', '2': '34569', '3': 'S83 Вывих аппарата коленного сустава',
         '4': './images/mrt3.jpg'},

    ]
    //const encryptedData = encrypt('F02.2 Болезнь Пика');
    //const filePath = './images/mrt1.jpg';
    //const ipfsHash = await addData(encryptedData);
    //const ipfsHashImage = await uploadImageToIPFS(filePath);
    //const patientAddress = '0x1Cb107cCE975d8c1a0Fb1a2b0E42300c629fa67e'; // замените на действительный адрес пациента
    for (const dt of data){
        await interactWithContract(dt[0], dt[1], dt[2], await addData(encrypt(dt[3])), await uploadImageToIPFS(dt[4]));
    }
};

main();
