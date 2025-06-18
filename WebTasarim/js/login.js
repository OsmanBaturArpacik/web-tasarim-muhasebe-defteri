if (localStorage.getItem('isLoggedIn') === 'true') {
    // Giriş yapılmamış index.html’e at
    window.location.href = '../index.html';
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value;

    // CSV dosyasını fetch edip parse edelim
    Papa.parse('../data/users.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const users = results.data;
            const match = users.find(u => u.username === userInput && u.password === passInput);

            if (match) {
                // Başarılı giriş
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', match.username);
                localStorage.setItem('user_id', match.user_id);
                window.location.href = '../index.html';
            } else {
                // Hata mesajı göster
                const err = document.getElementById('errorMsg');
                err.textContent = 'Kullanıcı adı veya parola hatalı.';
                err.style.display = 'block';
            }
        },
        error: function(err) {
            console.error('CSV yüklenirken hata:', err);
            const errEl = document.getElementById('errorMsg');
            errEl.textContent = 'Sistem hatası, lütfen tekrar deneyin.';
            errEl.style.display = 'block';
        }
    });
});
