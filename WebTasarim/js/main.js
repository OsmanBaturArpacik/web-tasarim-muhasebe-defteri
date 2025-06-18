window.onload = () => {
    // Kullanıcı login olmuşsa uygulamayı başlat
    if (localStorage.getItem('isLoggedIn') === 'true') {
        renderApp('homepage');
    } else {
        // Login sayfasına yönlendir
        window.location.href = 'components/login.html';
    }
};

function renderApp(activePage = 'homepage') {
    const app = document.getElementById('app');

    app.innerHTML = `
        ${createHeader()}
        <div class="d-flex" style="height: calc(100vh - 70px);">
            <div style="width: 250px;">
                ${createSidebar(activePage)}
            </div>
            <div class="flex-grow-1 bg-white">
                ${createContent(activePage)}
            </div>
        </div>
    `;

    setupHeaderName();
    setupSidebarEvents();
}
