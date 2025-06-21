export function calculateTotals(transactions) {
    let income = 0, expense = 0;
    transactions.forEach(t => {
        const amount = parseFloat(t.amount) || 0;
        if (t.type === 'income') income += amount;
        else if (t.type === 'expense') expense += amount;
    });
    return { income, expense };
}

export function filterTransactionsByPeriod(transactions, period) {
    const now = new Date();
    return transactions.filter(t => {
        const tDate = new Date(t.date);
        if (period === 'daily') return tDate.toDateString() === now.toDateString();
        if (period === 'monthly')
            return tDate.getFullYear() === now.getFullYear() &&
                tDate.getMonth() === now.getMonth();
        if (period === 'yearly')
            return tDate.getFullYear() === now.getFullYear();
        return true;
    });
}
