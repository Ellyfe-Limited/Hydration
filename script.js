let hydrationData = [];

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
    }

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');

        let theme = 'light';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
        }

        localStorage.setItem('theme', theme);
    });
});

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

    document.getElementById('result').innerText = `Hydration Index: ${hydration_index.toFixed(2)}%`;
    document.getElementById('hydration-progress').style.width = `${hydration_index}%`;
    document.getElementById('hydration-progress').ariaValueNow = hydration_index;

    hydrationData.push(data);
}

function downloadData() {
    const ws = XLSX.utils.json_to_sheet(hydrationData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hydration Data');
    XLSX.writeFile(wb, 'hydration_data.xlsx');
}
