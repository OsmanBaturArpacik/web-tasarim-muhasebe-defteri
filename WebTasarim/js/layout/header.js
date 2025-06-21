export function createHeader() {
    return `
        <header class="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
          <h4 class="mb-0">Kişisel Muhasebe Uygulaması</h4>
          <span id="userDisplay" class="fw-semibold">👤 Misafir</span>
        </header>
    `;
}

export function setupHeaderName() {
    const username = localStorage.getItem('username') || 'Misafir';
    const display = document.getElementById('userDisplay');
    if (display) {
        display.textContent = `👤 ${username}`;
    }
}
