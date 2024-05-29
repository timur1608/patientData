const Web3 = require('web3');
const contract = require('@truffle/contract');
const fs = require('fs');
const PatientRecordsArtifact = require('../build/contracts/PatientRecords.json');
const { getData, fetchImageFromIPFS } = require('../ipfs/ipfsClient');
const { decrypt } = require('../encryptor/encryptor'); // Убедись, что путь правильный

const web3 = new Web3('http://127.0.0.1:8545'); // Ganache endpoint

const PatientRecords = contract(PatientRecordsArtifact);
PatientRecords.setProvider(web3.currentProvider);


const fetchPatientData = async (patientAddress) => {
    const instance = await PatientRecords.deployed();
    const patient = await instance.getPatient(patientAddress);
    const patientData = {
        name: patient[0],
        cardNumber: patient[1],
        medicalHistoryCID: patient[2],
        imageHistoryCID: patient[3]
    };
    console.log('Patient Data:', patientData);
    const private_data = await getData(patient[2]);
    console.log('encrypted data from ipfs: ', private_data);
    const decryptedData = decrypt(private_data);
    console.log('data from ipfs: ', decryptedData);
    fetchImageFromIPFS(patient[3], './output.jpg');
};

const fetchAllPatients = async () => {
    const instance = await PatientRecords.deployed();
    const patientAddresses = await instance.getAllPatients();
    console.log('All Patient Addresses:', patientAddresses);

    for (let address of patientAddresses) {
        await fetchPatientData(address);
    }
};

const main = async () => {
    //const accounts = await web3.eth.getAccounts();
    //const patientAddress = accounts[1]; // Используем второй адрес из списка аккаунтов Ganache
    //await fetchPatientData(patientAddress);
    await fetchAllPatients();
};

main();
