const Web3 = require('web3');
const contract = require('@truffle/contract');
const PatientRecordsArtifact = require('../build/contracts/PatientRecords.json');

const web3 = new Web3('http://127.0.0.1:8545'); // Ganache endpoint

const PatientRecords = contract(PatientRecordsArtifact);
PatientRecords.setProvider(web3.currentProvider);

const interactWithContract = async () => {
    const instance = await PatientRecords.deployed();
    await instance.deletePatient();
};

const main = async () => {
    interactWithContract();
};

main();