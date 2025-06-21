import IncomeExpense from '../modules/incomeExpense.js';

export async function createContent(activePage = 'homepage') {
    switch (activePage) {
        case 'incomeExpense':
            await IncomeExpense.init();
            const html = IncomeExpense.render();
            setTimeout(() => IncomeExpense.setupEvents(), 0);  // eventleri kur
            return html;
        case 'report':
            // benzer
            return `<div>Raporlar</div>`;
        default:
            return `<div>🏠 Ana Sayfa</div>`;
    }
}
