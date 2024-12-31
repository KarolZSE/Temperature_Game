// This code is responsible for adjusting elements on the screen (visualy)
    const reset = document.getElementById('reset');
    const buttonid = document.getElementById('button');
    const temp_change = document.getElementById('temp_change');
    const bodyStyles = window.getComputedStyle(document.body);
    buttonid.style.width = `calc(100% - ${bodyStyles.marginLeft})`;
    temp_change.style.marginLeft = bodyStyles.marginLeft;
    temp_change.style.width = `calc(100% - ${bodyStyles.marginLeft})`;
    reset.style.marginLeft = bodyStyles.marginLeft;
    reset.style.width = `calc(100% - ${bodyStyles.marginLeft})`;
    reset.style.marginBottom = bodyStyles.marginLeft;
    const bodyMargin = getComputedStyle(document.body).margin;
    const response = document.getElementById('response');
    response.style.margin = -parseFloat(bodyMargin) + 'px';

// This code is responsible for range and the floating value above it
    const rangeInput = document.getElementById('temp');
    const rangeValue = document.getElementById('rangeValue');
    const popup = document.getElementById('popup');
    rangeInput.addEventListener('input', () => {
        rangeValue.textContent = rangeInput.value;
        const rect = rangeInput.getBoundingClientRect();
        const value = Math.round(parseFloat(rangeValue.textContent)) + parseInt(Math.abs(rangeInput.min));
        const rangeSum = parseInt(Math.abs(rangeInput.min)) + parseInt(rangeInput.max);
        popup.style.left = (value * (rect.width / rangeSum)) + rect.left - (popup.offsetWidth / 2 - rect.left) - (value / rangeSum * 15.75) - rangeInput.offsetLeft + rangeValue.offsetLeft + 'px';
    });

// This is the New Game button
    reset.addEventListener('click', () => {
        location.reload();
        });

// This code starts the work of range element
    const event = new Event('input');
    rangeInput.dispatchEvent(event);

    window.addEventListener('resize', () => {
            rangeInput.dispatchEvent(event);
        });

// This is the unit change button
    temp_change.addEventListener('click', () => {
        ctemp.then(result => {
            ctemps = result;
        if (temp_change.textContent === 'Change to Fahrenheit') {
            rangeInput.min = -130;
            rangeInput.max = 140;
            rangeValue.textContent = Math.round(parseFloat(rangeValue.textContent * (9 / 5)) + 32);
            ctemps = Math.round(parseFloat(ctemps * (9 / 5)) + 32);
            rangeInput.value = rangeValue.textContent;
            temp_symb.textContent = ' °F';
            temp_change.textContent = 'Change to Celsius';
        } else {
            rangeInput.min = -90;
            rangeInput.max = 60;
            rangeValue.textContent = Math.round(parseFloat(rangeValue.textContent - 32) / (9 / 5));
            ctemps = result;
            rangeInput.value = rangeValue.textContent;
            temp_symb.textContent = ' °C';
            temp_change.textContent = 'Change to Fahrenheit';
        }
    });
    });

// this is the lock in button
    buttonid.addEventListener('click', () => {
        if (typeof ctemps === 'undefined') {
        ctemp.then(result => {
            ctemps = result;
        })};
        setTimeout(() => {
            if (rangeValue.textContent == ctemps) {
                response.style.width = '100%';
                response.style.height = '100%';
                map.style.width = 0;
                popup.style.width = 0;
                popup.style.fontSize = 0;
                response.style.backgroundColor = 'green';
                response.innerHTML = 'Your geuss is correct!<br>Click anywhere to continue.';
        } else {
            if ((rangeValue.textContent > ctemps)) {
                response.style.width = '100%';
                response.style.height = '100%';
                map.style.width = 0;
                popup.style.width = 0;
                popup.style.fontSize = 0;
                response.style.backgroundColor = 'red';
                response.innerHTML = "Your guess is incorrect! It's colder than that!<br>Click anywhere to continue.";
            } else {
                response.style.width = '100%';
                response.style.height = '100%';
                map.style.width = 0;
                popup.style.width = 0;
                popup.style.fontSize = 0;
                response.style.backgroundColor = 'red';
                response.innerHTML = "Your guess is incorrect! It's warmer then that!<br>Click anywhere to continue.";
            }
        }}); 
        });

    response.addEventListener('click', () => {
        response.style.width = null;
        response.style.height = null;
        popup.style.width = null;
        popup.style.fontSize = null;
        map.style.width = null;
        response.innerHTML = null;
        });

// This is the function that calls all the apis to make the game work
    let ctemp = GetCity(1);
    async function GetCity(b) {
    try {
        const response = await fetch('https://randomuser.me/api');
        const data = await response.json();
        const city = data.results[0].location.city;

        const cityResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json`);
        const cityData = await cityResponse.json();
        const lat = parseFloat(cityData[0].lat);
        const lon = parseFloat(cityData[0].lon);
        
        const tempResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const tempData = await tempResponse.json();
        const ctemp = Math.round(tempData.current_weather.temperature);
        if (ctemp == -0) {
            ctemp = 0;
        }

        const map = L.map('map').setView([30, 10], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            L.marker([lat, lon]).addTo(map)
                .bindPopup(city)
                .openPopup();

        return ctemp * b;
    } catch (error) {
        const map = document.getElementById('map');
        map.textContent = 'Unexpected error occurred. Please refresh the page.';
    }
}
