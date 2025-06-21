export function createSidebar(active = 'homepage') {
    const buttons = [
        { id: 'homepage', label: 'Ana Sayfa' },
        { id: 'incomeExpense', label: 'Gelir/Gider İşlemleri' },
        { id: 'report', label: 'Gelir/Gider Raporları' }
    ];

    return `
        <div class="bg-white border-end p-3 h-100">
            <h5 class="text-primary mb-4">📘 Muhasebe Defteri</h5>
            ${buttons.map(btn => `
                <button data-id="${btn.id}" class="btn w-100 mb-2 ${btn.id === active ? 'btn-primary' : 'btn-outline-primary'}">${btn.label}</button>
            `).join('')}
            <button id="logoutBtn" class="btn btn-outline-danger w-100 mb-2">Çıkış Yap</button>
        </div>
    `;
}

export function setupSidebarEvents(renderApp) {
    const sidebar = document.querySelector('.border-end');
    const buttons = sidebar.querySelectorAll('button[data-id]');

    buttons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const newPage = btn.dataset.id;

            buttons.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-outline-primary');
            });
            btn.classList.remove('btn-outline-primary');
            btn.classList.add('btn-primary');

            await renderApp(newPage);
        });
    });

    const logoutBtn = sidebar.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('Çıkış yapılıyor...');
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'components/login.html';
        });
    }
}