const BASE_URL = 'http://localhost:3000';

const IncomeExpense = {
    transactions: [],
    categories: [],
    userId: localStorage.getItem('user_id'),

    async init() {
        await this.loadDataFromServer();
        this.renderUI();
    },

    async loadDataFromServer() {
        try {
            const resTx = await fetch(`${BASE_URL}/transactions`);
            const transactions = await resTx.json();
            this.transactions = transactions.filter(t => t.user_id === this.userId);

            const resCat = await fetch(`${BASE_URL}/categories`);
            const categories = await resCat.json();
            this.categories = categories.filter(c => c.user_id === this.userId);
        } catch (err) {
            console.error('Data loading error:', err);
            alert('Sunucudan veri alınırken hata oluştu.');
        }
    },

    getCategoriesByType(type) {
        return this.categories.filter(c => c.type === type);
    },

    async addTransaction(newTx) {
        try {
            const response = await fetch(`${BASE_URL}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTx),
            });
            if (response.status === 409) {
                const data = await response.json();
                alert(data.error);
                return;
            }
            await this.loadDataFromServer();
            this.renderUI();
        } catch (err) {
            console.error('Transaction add error:', err);
            alert('İşlem eklenirken hata oluştu.');
        }
    },

    async updateTransaction(updatedTx) {
        try {
            const response = await fetch(`${BASE_URL}/transactions/${updatedTx.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTx),
            });

            if (!response.ok) throw new Error('Güncelleme başarısız.');

            await this.loadDataFromServer();
            this.renderUI();
        } catch (err) {
            console.error('Transaction update error:', err);
            alert('İşlem güncellenirken hata oluştu.');
        }
    },

    async deleteTransaction(id) {
        await fetch(`${BASE_URL}/transactions/${id}`, { method: 'DELETE' });
        await this.loadDataFromServer();
        this.renderUI();
    },

    async addCategory(newCategory) {
        try {
            var response = await fetch(`${BASE_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory),
            });
            if (response.status === 409) {
                const data = await response.json();
                alert(data.error);
                return;
            }
        } catch(err) {
            alert('Sunucu hatası oluştu.');
        }

        await this.loadDataFromServer();
        this.renderUI();
    },

    async deleteCategory(id) {
        await fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
        await this.loadDataFromServer();
        this.renderUI();
    },

    setupEvents() {
        // Yeni kategori ekleme butonu
        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
            modal.show();
        });

        // Modal kapanınca backdrop temizle
        document.getElementById('categoryModal').addEventListener('hidden.bs.modal', () => {
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();

            // Inputu temizle
            document.getElementById('newCategoryName').value = '';
        });

        // Yeni işlem ekleme (Create)
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

            if (!newTx.note || !newTx.amount || !newTx.category_id) {
                return alert('Lütfen tüm alanları doldurun.');
            }

            await this.addTransaction(newTx);

            // Temizle
            document.getElementById('newNote').value = '';
            document.getElementById('newAmount').value = '';
        });

        // Kategori ekleme (modal içindeki buton)
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

            bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
        });

        // Tür seçimi değişince kategori listesini filtrele
        document.getElementById('newType').addEventListener('change', (e) => {
            const selectedType = e.target.value;
            this.updateCategorySelect(selectedType);
        });

        // Dinamik sil butonları için event delegation
        document.getElementById('app').addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.closest('tr').dataset.id;
                await this.deleteTransaction(id);
            }
            else if (e.target.classList.contains('update-btn')) {
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

        // Tür seçimi değişince ilgili satırdaki kategori select'ini de güncelle (editable rows)
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
    },

    updateCategorySelect(type) {
        const categorySelect = document.getElementById('newCategory');
        const filteredCategories = this.getCategoriesByType(type);
        categorySelect.innerHTML = filteredCategories
            .map(c => `<option value="${c.id}">${c.name}</option>`)
            .join('');
    },

    renderUI() {
        const container = document.getElementById('transaction-list');
        if (!container) return;
        container.innerHTML = this.render();

        // defaultType tekrar güncelle
        const newTypeSelect = document.getElementById('newType');
        const defaultType = newTypeSelect ? newTypeSelect.value : 'income';
        this.updateCategorySelect(defaultType);

        this.setupEvents();
    },

    render() {
        return `
    <div class="p-4">
      <h5>📋 İşlem Listesi</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Not</th>
            <th>Tutar</th>
            <th>Tür</th>
            <th>Kategori</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          ${this.transactions
            .map(
                (t) => `
            <tr data-id="${t.id}">
              <td>${t.date}</td>
              <td contenteditable="true" class="editable" data-field="note">${t.note}</td>
              <td contenteditable="true" class="editable" data-field="amount">${t.amount}</td>
              <td>
                <select class="form-select form-select-sm type-selector">
                  <option value="income" ${t.type === 'income' ? 'selected' : ''}>Gelir</option>
                  <option value="expense" ${t.type === 'expense' ? 'selected' : ''}>Gider</option>
                </select>
              </td>
              <td>
                <select class="form-select form-select-sm category-selector" data-type="${t.type}">
                  ${this.getCategoriesByType(t.type)
                    .map(
                        (c) =>
                            `<option value="${c.id}" ${t.category_id === c.id ? 'selected' : ''}>${c.name}</option>`
                    )
                    .join('')}
                </select>
              </td>
                <td>
                  <div class="d-flex">
                    <button class="btn btn-primary btn-sm update-btn me-1 w-100">Güncelle</button>
                    <button class="btn btn-danger btn-sm delete-btn">Sil</button>
                  </div>
                </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr>
            <td>${new Date().toISOString().split('T')[0]}</td>
            <td><input type="text" class="form-control form-control-sm" id="newNote" placeholder="Not"></td>
            <td>
              <div class="input-group input-group-sm">
                <input
                  type="number"
                  class="form-control"
                  id="newAmount"
                  placeholder="Tutar"
                  min="0"
                  step="0.01"
                  oninput="this.value = Math.max(0, this.value)"
                />
                <span class="input-group-text">₺</span>
              </div>
            </td>
            <td>
                <select id="newType" class="form-select form-select-sm">
                  <option value="" selected disabled>Tür seçin</option>
                  <option value="income">Gelir</option>
                  <option value="expense">Gider</option>
                </select>
            </td>
            <td>
              <div class="d-flex gap-1">
                <select id="newCategory" class="form-select form-select-sm flex-grow-1">
                  <!-- Kategoriler JS ile doldurulacak -->
                </select>
                <button id="addCategoryBtn" class="btn btn-outline-secondary btn-sm" title="Kategori Ekle">+</button>
              </div>
            </td>
            <td><button id="createBtn" class="btn btn-success w-100 btn-sm">Create</button></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Modal Kategori Ekleme -->
    <div
      class="modal fade"
      id="categoryModal"
      tabindex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Yeni Kategori Ekle</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Kapat"
            ></button>
          </div>
          <div class="modal-body">
            <input
              type="text"
              id="newCategoryName"
              class="form-control"
              placeholder="Kategori adı girin"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              İptal
            </button>
            <button type="button" id="saveCategoryBtn" class="btn btn-primary">
              Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
    },
};

export default IncomeExpense;