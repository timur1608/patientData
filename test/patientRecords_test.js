const PatientRecords = artifacts.require("PatientRecords");
const { addData, getData } = require('../ipfs/ipfsClient');
const { encrypt, decrypt } = require('../encryptor/encryptor');

contract("PatientRecords", accounts => {
  it("should add and retrieve a patient record", async () => {
    const patientRecordsInstance = await PatientRecords.deployed();
    
    // Encrypt and add data to IPFS
    const testData = "No history";
    const encryptedData = encrypt(testData);
    console.log(`Encrypted data: ${encryptedData}`);
    
    const cid = await addData(JSON.stringify(encryptedData));
    console.log(`CID: ${cid}`);
    
    await patientRecordsInstance.addPatient(accounts[0], "John Doe", "12345", cid);
    
    const patient = await patientRecordsInstance.getPatient(accounts[0]);
    console.log(`Retrieved patient: ${patient}`);
    
    assert.equal(patient[0], "John Doe", "Name is incorrect");
    assert.equal(patient[1], "12345", "Card number is incorrect");
    
    // Retrieve and decrypt data from IPFS
    const ipfsData = await getData(patient[2]);
    console.log(`Retrieved IPFS data: ${ipfsData}`);
    
    const decryptedData = decrypt(JSON.parse(ipfsData));
    console.log(`Decrypted data: ${decryptedData}`);
    
    assert.equal(decryptedData, testData, "Medical history is incorrect");
  });
});
