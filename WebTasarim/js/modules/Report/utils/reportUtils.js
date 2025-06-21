export function filterTransactionsByPeriodAndCategory(transactions, period, categoryId) {
    let filtered = transactions;

    // Kategori filtreleme
    if (categoryId) {
        filtered = filtered.filter(t => t.category_id === categoryId);
    }

    // Tarih filtreleme
    if (period !== 'all') {
        const now = new Date();
        filtered = filtered.filter(t => {
            const date = new Date(t.date);
            switch(period) {
                case 'daily':
                    return date.toDateString() === now.toDateString();
                case 'monthly':
                    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
                case 'yearly':
                    return date.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    }

    return filtered;
}

export function calculateTotals(transactions) {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.type === 'income') {
            income += Number(t.amount) || 0;
        } else if (t.type === 'expense') {
            expense += Number(t.amount) || 0;
        }
    });

    return { income, expense };
}
