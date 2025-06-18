function createContent(activePage = 'homepage') {
    switch (activePage) {
        case 'incomeExpense':
            return `<div class="p-4">💰 Gelir/Gider işlemleri içeriği buraya gelecek.</div>`;
        case 'report':
            return `<div class="p-4">📊 Raporlar içeriği buraya gelecek.</div>`;
        case 'homepage':
        default:
            return `<div class="p-4">🏠 Ana sayfa içeriği buraya gelecek.</div>`;
    }
}