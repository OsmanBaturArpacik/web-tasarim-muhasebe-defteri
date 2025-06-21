export function renderCategoryModal() {
    return `
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
}
