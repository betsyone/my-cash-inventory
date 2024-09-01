document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const fee = parseFloat(document.getElementById('fee').value);
    let reference = document.getElementById('reference').value;

    if (reference.length > 4) {
        reference = reference.slice(-4);
    }

    const date = new Date().toLocaleString();

    addTransaction(type, amount, fee, reference, date);
    saveTransactions();
    calculateSummary();
});

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

window.onload = function() {
    transactions.forEach((transaction, index) => {
        addTransactionToTable(transaction.type, transaction.amount, transaction.fee, transaction.reference, transaction.date, index);
    });
    calculateSummary();
};

function addTransaction(type, amount, fee, reference, date) {
    transactions.push({ type, amount, fee, reference, date });
    addTransactionToTable(type, amount, fee, reference, date, transactions.length - 1);
}

function addTransactionToTable(type, amount, fee, reference, date, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${type}</td>
        <td>${amount}</td>
        <td>${fee}</td>
        <td>${reference}</td>
        <td>${date}</td>
        <td>
            <button onclick="deleteTransaction(${index})">Delete</button>
        </td>
    `;
    document.getElementById('transactionTable').appendChild(row);
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function calculateSummary() {
    let totalCashIn = 0;
    let totalCashOut = 0;
    let totalFees = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'cashin') {
            totalCashIn += transaction.amount;
        } else {
            totalCashOut += transaction.amount;
        }
        totalFees += transaction.fee;
    });

    const balance = totalCashIn - totalCashOut;

    document.getElementById('totalCashIn').textContent = totalCashIn;
    document.getElementById('totalCashOut').textContent = totalCashOut;
    document.getElementById('totalFees').textContent = totalFees;
    document.getElementById('balance').textContent = balance;
}

function deleteTransaction(index) {
    const confirmDelete = confirm("Are you sure you want to delete this transaction?");
    if (confirmDelete) {
        transactions.splice(index, 1);
        saveTransactions();
        updateTable();
        calculateSummary();
    }
}

function updateTable() {
    const tableBody = document.getElementById('transactionTable');
    tableBody.innerHTML = '';

    transactions.forEach((transaction, index) => {
        addTransactionToTable(transaction.type, transaction.amount, transaction.fee, transaction.reference, transaction.date, index);
    });
}
