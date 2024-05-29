const express = require('express');
const Web3 = require('web3');
const contract = require('@truffle/contract');
const PatientRecordsArtifact = require('./build/contracts/PatientRecords.json');
const { getData, fetchImageFromIPFS } = require('./ipfs/ipfsClient');
const { decrypt } = require('./encryptor/encryptor'); // Убедись, что путь правильный

const app = express();
const port = 3000;

const web3 = new Web3('http://127.0.0.1:8545'); // Ganache endpoint

const PatientRecords = contract(PatientRecordsArtifact);
PatientRecords.setProvider(web3.currentProvider);

const getPatientData = async (cardNumber) => {
    const accounts = await web3.eth.getAccounts();
    const instance = await PatientRecords.deployed();
    const patient = await instance.getPatientByCardNumber(cardNumber, { from: accounts[0] });
    return patient;
};

app.get('/patient-data/:cardNumber', async (req, res) => {
    try {
        const cardNumber = req.params.cardNumber;
        const patient = await getPatientData(cardNumber);
        console.log("patient: ", patient);
        const patientData = {
            '0': patient[0],
            '1': patient[1],
            '2': decrypt(await getData(patient[2])),
            '3': patient[3]
        };
        res.json(patientData);
        console.log("patient_data: ", patientData);
    } catch (error) {
        console.error('Error fetching patient data:', error);
        res.status(500).send('Error fetching patient data');
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
