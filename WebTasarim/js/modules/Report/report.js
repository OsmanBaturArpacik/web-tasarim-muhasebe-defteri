import { fetchTransactions } from '../IncomeExpense/api/transactions.js';
import { fetchCategories } from '../IncomeExpense/api/categories.js';
import { calculateTotals, filterTransactionsByPeriodAndCategory } from './utils/reportUtils.js';

export default {
    transactions: [],
    categories: [],
    userId: localStorage.getItem('user_id'),

    async init() {
        await this.loadDataFromServer();
    },

    async loadDataFromServer() {
        try {
            this.transactions = await fetchTransactions(this.userId);
            this.categories = await fetchCategories(this.userId);
        } catch (err) {
            console.error('Data loading error:', err);
            alert('Sunucudan veri alınırken hata oluştu.');
        }
    },

    renderAndSetup() {
        const container = document.getElementById('transaction-list');
        if (!container) {
            console.error('transaction-list id\'li element bulunamadı!');
            return;
        }
        container.innerHTML = this.render();
        this.setupCharts();
    },

    render(period = 'all', categoryId = '') {
        const filtered = filterTransactionsByPeriodAndCategory(this.transactions, period, categoryId);
        const { income, expense } = calculateTotals(filtered);

        const safeIncome = Number(income) || 0;
        const safeExpense = Number(expense) || 0;

        const categoryOptions = ['<option value="">Kategori seçin</option>']
            .concat(this.categories.map(c => `<option value="${c.id}" ${categoryId.toString() === c.id.toString() ? 'selected' : ''}>${c.name}</option>`))
            .join('');

        return `
      <div class="p-4">
        <h5>📊 Raporlar</h5>
        <div class="d-flex gap-3 my-3">
          <div class="alert alert-success flex-fill">Toplam Gelir: <strong>${safeIncome.toFixed(2)} ₺</strong></div>
          <div class="alert alert-danger flex-fill">Toplam Gider: <strong>${safeExpense.toFixed(2)} ₺</strong></div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label for="periodFilter" class="form-label">Dönem Seçin:</label>
            <select id="periodFilter" class="form-select">
              <option value="all" ${period === 'all' ? 'selected' : ''}>Tümü</option>
              <option value="daily" ${period === 'daily' ? 'selected' : ''}>Günlük</option>
              <option value="monthly" ${period === 'monthly' ? 'selected' : ''}>Aylık</option>
              <option value="yearly" ${period === 'yearly' ? 'selected' : ''}>Yıllık</option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="categoryFilter" class="form-label">Kategori Seçin:</label>
            <select id="categoryFilter" class="form-select">
              ${categoryOptions}
            </select>
          </div>
        </div>

        ${filtered.length === 0
            ? `<div class="alert alert-warning">Gösterilecek işlem yok.</div>`
            : this.renderTable(filtered)
        }
      </div>
    `;
    },

    renderTable(filtered) {
        // İşlemleri tarih ve kategoriye göre listele (burada basit tablo)
        return `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Not</th>
            <th>Tutar</th>
            <th>Tür</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(t => `
            <tr>
              <td>${new Date(t.date).toLocaleDateString('tr-TR')}</td>
              <td>${t.note || '-'}</td>
              <td>${Number(t.amount).toFixed(2)} ₺</td>
              <td>${t.type === 'income' ? 'Gelir' : 'Gider'}</td>
              <td>${this.categories.find(c => c.id === t.category_id)?.name || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    },

    setupEvents() {
        const periodFilter = document.getElementById('periodFilter');
        const categoryFilter = document.getElementById('categoryFilter');

        periodFilter?.addEventListener('change', () => {
            const period = periodFilter.value;
            const categoryId = categoryFilter.value;
            this.renderAndSetup(period, categoryId);
        });

        categoryFilter?.addEventListener('change', () => {
            const period = periodFilter.value;
            const categoryId = categoryFilter.value;
            this.renderAndSetup(period, categoryId);
        });
    }
};
