export function renderTransactionTable(transactions, categories, defaultType = 'income') {
    const getCategoriesByType = (type) => categories.filter(c => c.type === type);

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
          ${transactions.map(t => `
            <tr data-id="${t.id}">
              <td>${t.date}</td>
              <td contenteditable="true" class="editable" data-field="note">${t.note}</td>
              <td contenteditable="true" class="editable" data-field="amount">${t.amount}</td>
              <td>
                <select class="form-select form-select-sm type-selector" style="min-width: 110px;">
                  <option value="income" ${t.type === 'income' ? 'selected' : ''}>Gelir</option>
                  <option value="expense" ${t.type === 'expense' ? 'selected' : ''}>Gider</option>
                </select>
              </td>
              <td>
                <select class="form-select form-select-sm category-selector" data-type="${t.type}">
                  ${getCategoriesByType(t.type).map(c => `
                    <option value="${c.id}" ${t.category_id === c.id ? 'selected' : ''}>${c.name}</option>
                  `).join('')}
                </select>
              </td>
              <td>
                <div class="d-flex">
                  <button class="btn btn-primary btn-sm update-btn me-1 w-100">Güncelle</button>
                  <button class="btn btn-danger btn-sm delete-btn">Sil</button>
                </div>
              </td>
            </tr>
          `).join('')}
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
    `;
}
