const BASE_URL = 'http://localhost:3000';

export async function fetchTransactions(userId) {
    const res = await fetch(`${BASE_URL}/transactions`);
    const transactions = await res.json();
    return transactions.filter(t => t.user_id === userId);
}

export async function addTransaction(newTx) {
    const res = await fetch(`${BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTx),
    });
    if (res.status === 409) {
        const data = await res.json();
        throw new Error(data.error);
    }
}

export async function updateTransaction(updatedTx) {
    const res = await fetch(`${BASE_URL}/transactions/${updatedTx.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTx),
    });
    if (!res.ok) throw new Error('Güncelleme başarısız.');
}

export async function deleteTransaction(id) {
    await fetch(`${BASE_URL}/transactions/${id}`, { method: 'DELETE' });
}
