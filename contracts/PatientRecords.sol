// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecords {
    struct Patient {
        string name;
        string cardNumber;
        string medicalHistoryCID; // IPFS CID
        string imageHistoryCID; // IPFS CID
    }

    mapping(address => Patient) private patients;
    mapping(string => Patient) private cardPatients;
    address[] private patientAddresses;

    function addPatient(address _patientAddress, string memory _name, string memory _cardNumber, string memory _medicalHistoryCID, string memory _imageHistoryCID) public {
        patients[_patientAddress] = Patient(_name, _cardNumber, _medicalHistoryCID, _imageHistoryCID);
        cardPatients[_cardNumber] = Patient(_name, _cardNumber, _medicalHistoryCID, _imageHistoryCID);
        bool f = false;
        for (uint i = 0; i < patientAddresses.length; i++){
            if (patientAddresses[i] == _patientAddress){
                f = true;
            }
        }
        if (!f){
            patientAddresses.push(_patientAddress);
        }
    }

    function getPatient(address _patientAddress) public view returns (string memory, string memory, string memory, string memory) {
        Patient memory patient = patients[_patientAddress];
        return (patient.name, patient.cardNumber, patient.medicalHistoryCID, patient.imageHistoryCID);
    }

    function getAllPatients() public view returns (address[] memory) {
        return patientAddresses;
    }
    function getPatientByCardNumber(string memory _cardNumber) public view returns (string memory, string memory, string memory, string memory) {
        Patient memory patient = cardPatients[_cardNumber];
        return (patient.name, patient.cardNumber, patient.medicalHistoryCID, patient.imageHistoryCID);
    }

    function deletePatient() public {
        delete patientAddresses[0];
    }
}
