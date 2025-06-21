import { createContent } from './layout/content.js';
import { createHeader, setupHeaderName } from './layout/header.js';
import { createSidebar, setupSidebarEvents } from './layout/sidebar.js';
import IncomeExpense from './modules/IncomeExpense/incomeExpense.js';
import Report from './modules/Report/report.js';

window.onload = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        renderApp('homepage');
    } else {
        window.location.href = 'components/login.html';
    }
};

async function renderApp(activePage = 'homepage') {
    const app = document.getElementById('app');
    const contentHTML = await createContent(activePage);

    app.innerHTML = `
    ${createHeader()}
    <div class="d-flex" style="height: calc(100vh - 70px);">
      <div style="width: 250px;">${createSidebar(activePage)}</div>
      <div class="flex-grow-1 bg-white">
        <div id="transaction-list">${contentHTML}</div>
      </div>
    </div>
  `;

    setupHeaderName();
    setupSidebarEvents(renderApp);

    //if (activePage === 'incomeExpense') {
    //    await IncomeExpense.init();
    //    await IncomeExpense.setupEvents();
    //} else if (activePage === 'report') {
    //    await Report.setupEvents();
    //}
}
