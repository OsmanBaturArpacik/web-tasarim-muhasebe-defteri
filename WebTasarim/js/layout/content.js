import IncomeExpense from '../modules/IncomeExpense/incomeExpense.js';
import Report from '../modules/Report/report.js';

export async function createContent(activePage = 'homepage') {
    switch (activePage) {
        case 'incomeExpense':
            await IncomeExpense.init();
            const html = IncomeExpense.render();
            setTimeout(() => IncomeExpense.setupEvents(), 0);  // eventleri kur
            return html;
        case 'report':
            await Report.init();
            const reportHTML = Report.render();
            setTimeout(() => Report.setupEvents(), 0); // Eventleri bağla
            return reportHTML;
        default:
            return `<div>🏠 Ana Sayfa</div>`;
    }
}
