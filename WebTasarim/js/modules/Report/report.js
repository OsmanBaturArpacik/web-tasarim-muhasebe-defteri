import { fetchTransactions } from '../IncomeExpense/api/transactions.js';
import { fetchCategories } from '../IncomeExpense/api/categories.js';
import { calculateTotals, filterTransactionsByPeriod } from './utils.js';

export default {
    transactions: [],
    categories: [],
    userId: localStorage.getItem('user_id'),

    async init() {
        await this.loadDataFromServer();
        document.getElementById('transaction-list').innerHTML = this.render();
        this.setupEvents();
    },

    async loadDataFromServer() {
        try {
            this.transactions = await fetchTransactions(this.userId);
            this.categories = await fetchCategories(this.userId);
            console.log(this.transactions)
            console.log(this.categories)
        } catch (err) {
            console.error('Data loading error:', err);
            alert('Sunucudan veri alınırken hata oluştu.');
        }
    },

    render(period = 'all') {
        const filtered = filterTransactionsByPeriod(this.transactions, period);
        const { income, expense } = calculateTotals(filtered);

        return `
        <div class="p-4">
          <h5>📊 Raporlar (${period === 'all' ? 'Tümü' : period})</h5>
          <div class="d-flex gap-3 my-3">
            <div class="alert alert-success flex-fill">Toplam Gelir: <strong>${income.toFixed(2)} ₺</strong></div>
            <div class="alert alert-danger flex-fill">Toplam Gider: <strong>${expense.toFixed(2)} ₺</strong></div>
          </div>
          <div class="btn-group mb-3" role="group">
            <button class="btn btn-outline-primary report-filter" data-period="daily">Günlük</button>
            <button class="btn btn-outline-primary report-filter" data-period="monthly">Aylık</button>
            <button class="btn btn-outline-primary report-filter" data-period="yearly">Yıllık</button>
            <button class="btn btn-outline-secondary report-filter" data-period="all">Tümü</button>
          </div>
        </div>`;
    },

    setupEvents() {
        document.querySelectorAll('.report-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                const period = btn.dataset.period;
                const container = document.getElementById('transaction-list'); // Doğru container
                container.innerHTML = this.render(period);
                this.setupEvents(); // innerHTML sonrası yeniden bağla
            });
        });
    }
};
