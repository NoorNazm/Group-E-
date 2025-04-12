
document.addEventListener('DOMContentLoaded', function() {
    const totalBooksInput = document.getElementById('totalBooks');
    const groupSizeInput = document.getElementById('groupSize');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultBox = document.getElementById('resultBox');
    const resultValue = document.getElementById('resultValue');
    const showTableBtn = document.getElementById('showTableBtn');


    let dpTableModal;

    document.addEventListener('DOMContentLoaded', function() {
        dpTableModal = new bootstrap.Modal(document.getElementById('dpTableModal'));
    });


    let calculationData = null;

    calculateBtn.addEventListener('click', async function() {
        const n = parseInt(totalBooksInput.value);
        const r = parseInt(groupSizeInput.value);


        if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
            alert('Please enter valid positive numbers.');
            return;
        }

        try {
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ n, r }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || 'An error occurred');
                return;
            }

            calculationData = await response.json();

           
            resultValue.textContent = calculationData.result.toLocaleString();
            resultBox.classList.remove('d-none');
            showTableBtn.classList.remove('d-none');

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while calculating. Please try again.');
        }
    });

    showTableBtn.addEventListener('click', function() {
        if (!calculationData) return;

        const dpTable = document.getElementById('dpTable');
        const { dp_table, n, r } = calculationData;


        dpTable.innerHTML = '';


        const headerRow = document.createElement('tr');


        const cornerCell = document.createElement('th');
        cornerCell.textContent = 'n\\r';
        headerRow.appendChild(cornerCell);


        for (let j = 0; j <= r; j++) {
            const th = document.createElement('th');
            th.textContent = j;
            headerRow.appendChild(th);
        }

        dpTable.appendChild(headerRow);


        for (let i = 0; i <= n; i++) {
            const row = document.createElement('tr');


            const rowHeader = document.createElement('th');
            rowHeader.textContent = i;
            row.appendChild(rowHeader);


            for (let j = 0; j <= r; j++) {
                const cell = document.createElement('td');


                if (j <= Math.min(r, i)) {
                    cell.textContent = dp_table[i][j].toLocaleString();


                    if (i === n && j === r) {
                        cell.classList.add('highlight-cell');
                    }
                } else {
                    cell.textContent = '-';
                }

                row.appendChild(cell);
            }

            dpTable.appendChild(row);
        }


        document.getElementById('dpTableModalLabel').textContent =
            `Dynamic Programming Table for P(${n},${r})`;


        const dpTableModal = new bootstrap.Modal(document.getElementById('dpTableModal'));
        dpTableModal.show();
    });
});