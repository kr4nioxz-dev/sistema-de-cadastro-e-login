// dashboard.js — Esta página só existe pra quem tem uma sessão válida.
// A proteção real não é o arquivo HTML (ele é público, qualquer um acha a URL),
// é a chamada para /api/me: sem sessão, o servidor responde 401 e mandamos
// o visitante de volta pro login antes de mostrar qualquer dado.

const nameEl = document.getElementById('dashboardUserName');
const emailEl = document.getElementById('dashboardUserEmail');
const logoutBtn = document.getElementById('logoutBtn');

async function loadCurrentUser() {
  try {
    const response = await fetch('/api/me');

    if (!response.ok) {
      window.location.href = '/index.html';
      return;
    }

    const user = await response.json();
    nameEl.textContent = `Olá, ${user.name}!`;
    emailEl.textContent = user.email;
  } catch (error) {
    window.location.href = '/index.html';
  }
}

logoutBtn.addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/index.html';
});

loadCurrentUser();
