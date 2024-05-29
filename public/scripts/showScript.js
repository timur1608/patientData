const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const fetchPatientData = async () => {
    const cardNumber = getQueryParam('cardNumber');
    if (!cardNumber) {
        alert('No card number provided');
        return;
    }
    
    try {
        const response = await fetch(`/patient-data/${cardNumber}`);
        const data = await response.json();
        
        document.getElementById('patient-name').innerText = `Name: ${data[0]}`;
        document.getElementById('patient-disease').innerText = `Diseases: ${data[2]}`;
        const imageUrl = `http://localhost:8080/ipfs/${data[3]}`;
        document.getElementById('patient-image').src = imageUrl;
    } catch (error) {
        console.error('Error fetching patient data:', error);
    }
};

window.onload = fetchPatientData;