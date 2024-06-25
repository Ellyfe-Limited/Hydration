let hydrationData = [];

function getFormData() {
    return {
        heart_rate: parseFloat(document.getElementById('heart-rate').value),
        spo2: parseFloat(document.getElementById('spo2').value),
        respiration_rate: parseFloat(document.getElementById('respiration-rate').value),
        ambient_temp: parseFloat(document.getElementById('ambient-temp').value),
        skin_temp: parseFloat(document.getElementById('skin-temp').value),
        age: parseFloat(document.getElementById('age').value),
        height: parseFloat(document.getElementById('height').value),
        sex: document.getElementById('sex').value,
        body_weight: parseFloat(document.getElementById('body-weight').value)
    };
}

function validateInput(data) {
    for (const key in data) {
        if (key !== 'sex' && (data[key] <= 0 || isNaN(data[key]))) {
            alert(`Invalid input for ${key.replace('_', ' ')}. All values must be greater than zero.`);
            return false;
        }
    }
    return true;
}

function calculateHydration() {
    const data = getFormData();
    if (!validateInput(data)) {
        return;
    }

    const tbw = data.sex === 'M'
        ? 2.447 - 0.09516 * data.age + 0.1074 * data.height + 0.3362 * data.body_weight
        : -2.097 + 0.1069 * data.height + 0.2466 * data.body_weight;

    let hydration_index = tbw / data.body_weight * 100;

    hydration_index -= data.heart_rate > 100 ? 50 * ((data.heart_rate - 100) / 100) : 0;
    hydration_index -= data.spo2 < 95 ? 50 * ((95 - data.spo2) / 95) : 0;
    hydration_index -= data.respiration_rate > 20 ? 50 * ((data.respiration_rate - 20) / 20) : 0;
    hydration_index -= data.ambient_temp > 30 ? 50 * ((data.ambient_temp - 30) / 30) : 0;
    hydration_index -= data.skin_temp > 37 ? 50 * ((data.skin_temp - 37) / 37) : 0;

    hydration_index = Math.max(0, Math.min(hydration_index, 100));

    let classification;
    if (hydration_index < 30) {
        classification = "Dehydrated";
        updateProgressBar(hydration_index, 'bg-danger');
    } else if (hydration_index < 60) {
        classification = "Mild Dehydrated";
        updateProgressBar(hydration_index, 'bg-warning');
    } else {
        classification = "Hydrated";
        updateProgressBar(hydration_index, 'bg-success');
    }

    document.getElementById('result').innerText = `Hydration Index: ${hydration_index.toFixed(2)}% - ${classification}`;

    // Save data
    hydrationData.push({
        ...data,
        hydration_index: hydration_index.toFixed(2),
        classification: classification
    });
}

function updateProgressBar(value, className) {
    const progressBar = document.getElementById('hydration-progress');
    progressBar.style.width = `${value}%`;
    progressBar.setAttribute('aria-valuenow', value);
    progressBar.className = `progress-bar ${className}`;
}

function downloadData() {
    const worksheet = XLSX.utils.json_to_sheet(hydrationData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hydration Data");
    XLSX.writeFile(workbook, "hydration_data.xlsx");
}
