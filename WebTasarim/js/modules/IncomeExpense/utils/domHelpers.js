export function updateCategorySelect(selectElement, categories, type) {
    const filtered = categories.filter(c => c.type === type);
    selectElement.innerHTML = `
        <option value="" selected disabled>Kategori seçin</option>
        ${filtered.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
    `;
}