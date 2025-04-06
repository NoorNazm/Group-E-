const input = document.getElementById('autocomplete-input');
const suggestionsList = document.getElementById('suggestions');
const showLcsButton = document.getElementById('show-lcs');
const lcsInfo = document.getElementById('lcs-info');
const lcsLength = document.getElementById('lcs-length');
const lcsString = document.getElementById('lcs-string');
const similarity = document.getElementById('similarity');
const lcsTable = document.getElementById('lcs-table');

input.addEventListener('input', async () => {
    const prefix = input.value;
    if (prefix.length > 0) {
        const response = await fetch(`http://localhost:5000/autocomplete?prefix=${prefix}`);
        const suggestions = await response.json();
        displaySuggestions(suggestions);
    } else {
        suggestionsList.innerHTML = '';
    }
});

function displaySuggestions(suggestions) {
    suggestionsList.innerHTML = '';
    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        li.addEventListener('click', () => {
            input.value = suggestion;
            suggestionsList.innerHTML = '';
        });
        suggestionsList.appendChild(li);
    });
}

showLcsButton.addEventListener('click', async () => {
    const word1 = input.value;
    const word2 = suggestionsList.firstChild ? suggestionsList.firstChild.textContent : '';

    if (!word1 || !word2) {
        alert("Please select a word from suggestions!");
        return;
    }

    const response = await fetch(`http://localhost:5000/lcs?word1=${word1}&word2=${word2}`);
    const lcsData = await response.json();
    displayLcsInfo(lcsData);
});

function displayLcsInfo(lcsData) {
    lcsLength.textContent = lcsData.lcs_length;
    lcsString.textContent = lcsData.lcs_string;
    similarity.textContent = lcsData.similarity.toFixed(2);

    lcsTable.innerHTML = ''; // Clear previous table
    const table = document.createElement('table');

    for (let i = 0; i < lcsData.table.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < lcsData.table[i].length; j++) {
            const cell = document.createElement('td');

            // Combine the table value and arrow
            const cellValue = lcsData.table[i][j];
            const arrow = lcsData.arrows[i][j]; // Get the corresponding arrow
            cell.textContent = `${cellValue} ${arrow}`;

            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    lcsTable.appendChild(table);
    lcsInfo.style.display = 'block';
}
