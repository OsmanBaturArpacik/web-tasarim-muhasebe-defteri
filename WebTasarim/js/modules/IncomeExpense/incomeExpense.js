import * as categoryApi from './api/categories.js';
import * as transactionApi from './api/transactions.js';
import { renderTransactionTable } from './components/transactionTable.js';
import { renderCategoryModal } from './components/modal.js';
import { updateCategorySelect } from './utils/domHelpers.js';

const IncomeExpense = {
    transactions: [],
    categories: [],
    userId: localStorage.getItem('user_id'),

    async init() {
        await this.loadDataFromServer();
        this.renderUI();
    },

    render() {
        return `
        <div id="transaction-list">
            ${renderTransactionTable(this.transactions, this.categories)}
            ${renderCategoryModal()}
        </div>
    `;
    },

    async loadDataFromServer() {
        try {
            this.transactions = await transactionApi.fetchTransactions(this.userId);
            this.categories = await categoryApi.fetchCategories(this.userId);
        } catch (err) {
            console.error('Data loading error:', err);
            alert('Sunucudan veri alınırken hata oluştu.');
        }
    },

    renderUI() {
        const container = document.getElementById('transaction-list');
        if (!container) return;

        container.innerHTML = renderTransactionTable(this.transactions, this.categories);
        container.insertAdjacentHTML('beforeend', renderCategoryModal());

        const newTypeSelect = document.getElementById('newType');
        const defaultType = newTypeSelect ? newTypeSelect.value || 'income' : 'income';
        //updateCategorySelect(document.getElementById('newCategory'), this.categories, defaultType);

        this.setupEvents();
    },

    getCategoriesByType(type) {
        return this.categories.filter(c => c.type === type);
    },

    async addTransaction(newTx) {
        try {
            await transactionApi.addTransaction(newTx);
            await this.loadDataFromServer();
            this.renderUI();
        } catch (err) {
            alert(err.message || 'İşlem eklenirken hata oluştu.');
        }
    },

    async updateTransaction(updatedTx) {
        try {
            await transactionApi.updateTransaction(updatedTx);
            await this.loadDataFromServer();
            this.renderUI();
        } catch (err) {
            alert(err.message || 'İşlem güncellenirken hata oluştu.');
        }
    },

    async deleteTransaction(id) {
        try {
            await transactionApi.deleteTransaction(id);
            await this.loadDataFromServer();
            this.renderUI();
        } catch (err) {
            alert('İşlem silinirken hata oluştu.');
        }
    },

    async addCategory(newCategory) {
        try {
            await categoryApi.addCategory(newCategory);
            await this.loadDataFromServer();
            this.renderUI();
        } catch (err) {
            alert(err.message || 'Kategori eklenirken hata oluştu.');
        }
    },

    async deleteCategory(id) {
        try {
            await categoryApi.deleteCategory(id);
            await this.loadDataFromServer();
            this.renderUI();
        } catch (err) {
            alert('Kategori silinirken hata oluştu.');
        }
    },

    setupEvents() {

        // Yeni işlem ekleme
        document.getElementById('createBtn').addEventListener('click', async () => {
            const newTx = {
                id: crypto.randomUUID(),
                user_id: this.userId,
                date: new Date().toISOString().split('T')[0],
                note: document.getElementById('newNote').value.trim(),
                amount: document.getElementById('newAmount').value,
                type: document.getElementById('newType').value,
                category_id: document.getElementById('newCategory').value,
            };

            if (!newTx.note || !newTx.amount || !newTx.type || !newTx.category_id) {
                return alert('Lütfen tüm alanları doldurun.');
            }

            await this.addTransaction(newTx);

            // Temizle
            document.getElementById('newNote').value = '';
            document.getElementById('newAmount').value = '';
            document.getElementById('newType').value = '';
            this.updateCategorySelect(document.getElementById('newCategory'), this.categories, '');
        });

        // Modal gösterme
        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
            modal.show();
        });

        // Modal kapandığında kesin temizlik
        const modalEl = document.getElementById('categoryModal');
        modalEl.addEventListener('hidden.bs.modal', () => {
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();

            // Input temizliği
            document.getElementById('newCategoryName').value = '';
        });


        // Kategori ekleme butonu
        document.getElementById('saveCategoryBtn').addEventListener('click', async () => {
            const name = document.getElementById('newCategoryName').value.trim();
            if (!name) return alert('Kategori adı boş olamaz.');

            const selectedType = document.getElementById('newType').value;

            const newCategory = {
                id: String(Date.now()),
                user_id: this.userId,
                name,
                type: selectedType,
            };

            await this.addCategory(newCategory);

            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            // Modal kapanmadan sonra 300ms bekle, sonra tekrar temizle (yedek)
            setTimeout(() => {
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
            }, 300);
        });

        // Tür değişince kategori güncelle
        document.getElementById('newType').addEventListener('change', (e) => {
            const selectedType = e.target.value;
            updateCategorySelect(document.getElementById('newCategory'), this.categories, selectedType);
        });

        // Dinamik tablo butonları (sil/güncelle)
        document.getElementById('app').addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.closest('tr').dataset.id;
                await this.deleteTransaction(id);
            } else if (e.target.classList.contains('update-btn')) {
                const tr = e.target.closest('tr');
                const id = tr.dataset.id;
                const note = tr.querySelector('[data-field="note"]').innerText.trim();
                const amount = tr.querySelector('[data-field="amount"]').innerText.trim();
                const type = tr.querySelector('.type-selector').value;
                const category_id = tr.querySelector('.category-selector').value;

                if (!note || !amount || !category_id) {
                    return alert('Lütfen tüm alanları doldurun.');
                }

                const updatedTx = {
                    id,
                    user_id: this.userId,
                    date: tr.children[0].innerText.trim(),
                    note,
                    amount,
                    type,
                    category_id
                };
                await this.updateTransaction(updatedTx);
            }
        });

        // Tablo içinde tür değişimi -> kategori güncelleme
        document.getElementById('app').addEventListener('change', (e) => {
            if (e.target.classList.contains('type-selector')) {
                const tr = e.target.closest('tr');
                const newType = e.target.value;
                const categorySelect = tr.querySelector('.category-selector');
                const categories = this.getCategoriesByType(newType);
                categorySelect.innerHTML = categories
                    .map(c => `<option value="${c.id}">${c.name}</option>`)
                    .join('');
            }
        });
    }
};

export default IncomeExpense;
