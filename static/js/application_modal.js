function filterTable() {
    let input = document.getElementById('search').value.toLowerCase();
    let rows = document.querySelectorAll('#application-table tbody tr');

    rows.forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
}

function openModal() {
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('addForm').reset();
}

function updateRowNumbers() {
    const tableRows = document.querySelectorAll('#application-table tbody tr');
    tableRows.forEach((row, index) => {
        row.cells[0].innerText = index + 1;
    });
}

async function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
        id: formData.get('id'),
        reg_day: formData.get('reg_day'),
        reg_month: formData.get('reg_month'),
        reg_year: formData.get('reg_year'),
        outgoing_id: formData.get('outgoing_id'),
        outgoing_day: formData.get('outgoing_day'),
        outgoing_month: formData.get('outgoing_month'),
        outgoing_year: formData.get('outgoing_year'),
        company_name: formData.get('company'),
        purchase_subject: formData.get('subject'),
        amount: formData.get('amount')
    };

    try {
        const response = await fetch('/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            closeModal();

            const tableBody = document.querySelector('#application-table tbody');
            const newRow = document.createElement('tr');
            newRow.dataset.appId = data.id;
            newRow.dataset.regDay = data.reg_day;
            newRow.dataset.regMonth = data.reg_month;
            newRow.dataset.regYear = data.reg_year;
            newRow.dataset.outgoingId = data.outgoing_id;
            newRow.dataset.outgoingDay = data.outgoing_day;
            newRow.dataset.outgoingMonth = data.outgoing_month;
            newRow.dataset.outgoingYear = data.outgoing_year;
            newRow.dataset.companyName = data.company_name;
            newRow.dataset.purchaseSubject = data.purchase_subject;
            newRow.dataset.amount = data.amount;

            newRow.innerHTML = `
                <td></td>
                <td><b>№ ${data.id}</b> от ${String(data.reg_day).padStart(2, '0')}/${String(data.reg_month).padStart(2, '0')}/${data.reg_year}</td>
                <td><b>№ ${data.outgoing_id}</b> от ${String(data.outgoing_day).padStart(2, '0')}/${String(data.outgoing_month).padStart(2, '0')}/${data.outgoing_year}</td>
                <td>
                    <center>${data.company_name}</center>
                </td>
                <td>${data.purchase_subject}<b> - (${data.amount} руб.)</b> Подробнее <i class="fas fa-info-circle" style="color:#689F38;"></i></td>
                <td class="editable-cell economist-cell" data-column="economist_info" data-app-id="${data.id}"
                    data-economist-info="{}">
                    <span class="status-indicator status-empty"></span>
                </td>
                <td class="editable-cell purchase-cell" data-column="purchase_info" data-app-id="${data.id}"
                    data-purchase-info="{}">
                    <span class="status-indicator status-empty"></span>
                </td>
                <td class="editable-cell docs-cell" data-column="exec_docs_info" data-app-id="${data.id}"
                    data-exec-docs-info="{}">
                    <span class="status-indicator status-empty"></span>
                </td>
                <td class="editable-cell lawyer-cell" data-column="lawyer_info" data-app-id="${data.id}"
                    data-lawyer-info="{}">
                    <span class="status-indicator status-empty"></span>
                </td>
                <td class="editable-cell accountant-cell" data-column="accountant_info" data-app-id="${data.id}"
                    data-accountant-info="{}">
                    <span class="status-indicator status-empty"></span>
                </td>
            `;
            tableBody.insertBefore(newRow, tableBody.firstChild);
            updateRowNumbers(); // Update the row numbers
        } else {
            // Error handling
        }
    } catch (error) {
        // Network error handling
    }
}

function validateDate(day, month, year) {
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === parseInt(year) &&
        date.getMonth() === parseInt(month) - 1 &&
        date.getDate() === parseInt(day)
    );
}

async function clearData() {
    if (confirm("Удалить все записи безвозвратно?")) {
        try {
            const response = await fetch('/clear', {
                method: 'POST'
            });
            if (response.ok) {
                window.location.reload();
            } else {
                const result = await response.json();
                alert(result.message || 'Ошибка при очистке данных!');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка сети!');
        }
    }
}

async function exportToExcel() {
    try {
        window.location.href = '/export';
    } catch (error) {
        console.error('Ошибка экспорта:', error);
        alert('Ошибка при экспорте!');
    }
}