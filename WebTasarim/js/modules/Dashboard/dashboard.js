import Report from '../Report/report.js'; // rapordaki hesaplama fonksiyonları için

export default {
    data: null,  // transaction ve kategori verileri

    async init() {
        await Report.init();
        this.data = {
            transactions: Report.transactions,
            categories: Report.categories
        };
    },

    render() {
        const { transactions } = this.data;
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);

        return `
    <div class="p-4">
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card bg-success text-white p-3">
                    <h5>Toplam Gelir</h5>
                    <h3>${income.toFixed(2)} ₺</h3>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card bg-danger text-white p-3">
                    <h5>Toplam Gider</h5>
                    <h3>${expense.toFixed(2)} ₺</h3>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6" style="height:400px;">
                <canvas id="incomeExpenseChart" style="width: 100%; height: 100%;"></canvas>
            </div>
            <div class="col-md-6" style="height:400px;">
                <canvas id="expenseByCategoryChart" style="width: 100%; height: 100%;"></canvas>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    `;
    },

    setupEvents() {
        const { transactions, categories } = this.data;

        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);

        const ctx1 = document.getElementById('incomeExpenseChart').getContext('2d');
        new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['Gelir', 'Gider'],
                datasets: [{
                    label: 'Gelir vs Gider',
                    data: [income, expense],
                    backgroundColor: ['#28a745', '#dc3545'],
                    hoverOffset: 30
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    title: { display: true, text: 'Gelir ve Gider Dağılımı' }
                }
            }
        });

        const expenseByCategoryMap = {};
        transactions.forEach(t => {
            if (t.type === 'expense') {
                const catName = categories.find(c => c.id === t.category_id)?.name || 'Bilinmeyen';
                expenseByCategoryMap[catName] = (expenseByCategoryMap[catName] || 0) + Number(t.amount);
            }
        });

        const categoryLabels = Object.keys(expenseByCategoryMap);
        const categoryData = Object.values(expenseByCategoryMap);

        const ctx2 = document.getElementById('expenseByCategoryChart').getContext('2d');
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: categoryLabels,
                datasets: [{
                    label: 'Kategori Bazlı Giderler',
                    data: categoryData,
                    backgroundColor: '#dc3545'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Kategori Bazlı Giderler' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 100 }
                    }
                }
            }
        });
    }
};
