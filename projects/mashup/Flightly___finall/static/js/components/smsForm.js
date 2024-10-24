export function initSmsForm() {
    const trackButton = document.querySelector('.trackingbutton1');
    const smsForm = document.querySelector('.sms-form');

    if (trackButton) {
        trackButton.addEventListener('click', toggleSmsFormVisibility);
    } else {
        console.error("Track button not found");
    }

    if (smsForm) {
        smsForm.addEventListener('submit', handleSmsFormSubmit);
    } else {
        console.error("SMS form not found");
    }
}

function toggleSmsFormVisibility(event) {
    event.preventDefault();
    const smsForm = document.getElementById('sms_form');
    if (smsForm) {
        smsForm.style.display = (smsForm.style.display === 'none' || smsForm.style.display === '') ? 'block' : 'none';
    } else {
        console.error("SMS form element not found");
    }
}

async function handleSmsFormSubmit(event) {
    event.preventDefault();
    console.log("Form submitted");

    const nameField = document.getElementById('namefield');
    const numberField = document.getElementById('numberfield');

    if (!nameField || !numberField) {
        console.error("Name or number field not found");
        return;
    }

    const name = nameField.value;
    const phoneNumber = numberField.value;

    console.log("Name:", name, "Phone:", phoneNumber);

    // Collect all necessary data
    const flightData = collectFlightData();
    const dataToSend = [...flightData, name, phoneNumber];

    console.log("Data to send:", dataToSend);

    await sendDataToFlask(dataToSend);

    // Clear the input fields after tracking
    nameField.value = '';
    numberField.value = '';
}

function collectFlightData() {
    const fields = [
        'dept_airport', 'arr_airport', 'flight_num', 'dept_terminal', 'arr_terminal',
        'dept_gate', 'arr_gate', 'live_status', 'dept_city', 'arr_city',
        'dept_date', 'dept_time', 'arr_date', 'arr_time', 'dept_temperature',
        'dept_humidity', 'dept_windspeed', 'arr_temperature', 'arr_humidity', 'arr_windspeed'
    ];

    return fields.map(id => {
        const element = document.getElementById(id);
        if (element) {
            return element.textContent;
        } else {
            console.error(`Element with id ${id} not found`);
            return '';
        }
    });
}

async function sendDataToFlask(data) {
    try {
        console.log("Sending data to Flask:", data);
        const response = await fetch('/api/retrieve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log("Response from Flask:", jsonResponse);
            alert("Thank you for tracking your flight with us!");
        } else {
            console.error("Error sending data to Flask");
            alert("Error sending flight information. Please try again.");
        }
    } catch (error) {
        console.error("Error sending data to Flask:", error);
        alert("Error sending flight information. Please try again.");
    }
}
