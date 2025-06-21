export function renderTransactionTable(transactions, categoriesByType) {
    return `
      ${transactions
        .map(t => {
            const categoryOptions = categoriesByType[t.type]
                .map(c => `<option value="${c.id}" ${c.id === t.category_id ? 'selected' : ''}>${c.name}</option>`)
                .join('');
            return `
                <tr data-id="${t.id}">
                    <td>${t.date}</td>
                    <td contenteditable="true" data-field="note">${t.note}</td>
                    <td contenteditable="true" data-field="amount">${t.amount}</td>
                    <td>
                        <select class="form-select form-select-sm type-selector">
                            <option value="income" ${t.type === 'income' ? 'selected' : ''}>Gelir</option>
                            <option value="expense" ${t.type === 'expense' ? 'selected' : ''}>Gider</option>
                        </select>
                    </td>
                    <td>
                        <select class="form-select form-select-sm category-selector">${categoryOptions}</select>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-sm update-btn">Güncelle</button>
                        <button class="btn btn-danger btn-sm delete-btn">Sil</button>
                    </td>
                </tr>
            `;
        })
        .join('')}
    `;
}
