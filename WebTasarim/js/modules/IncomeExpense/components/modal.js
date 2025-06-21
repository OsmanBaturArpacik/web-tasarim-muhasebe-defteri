export function setupCategoryModal() {
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();

    document.getElementById('categoryModal').addEventListener('hidden.bs.modal', () => {
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        document.getElementById('newCategoryName').value = '';
    });
}
