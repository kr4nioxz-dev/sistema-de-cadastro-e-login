// script.js — Interações da tela: alternância login/cadastro e comunicação com a API

// --- Referências aos elementos usados no script ---
const splitContainer = document.getElementById('splitContainer');
const toggleModeBtn = document.getElementById('toggleModeBtn');
const welcomeSubtitle = document.getElementById('welcomeSubtitle');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginMessage = document.getElementById('loginMessage');
const signupMessage = document.getElementById('signupMessage');

// Textos que mudam dependendo do modo atual (login vs. cadastro)
const CONTENT = {
  login: {
    subtitle: 'Não tem uma conta? Crie uma agora mesmo.',
    buttonLabel: 'Criar'
  },
  signup: {
    subtitle: 'Já tem uma conta? Entre agora mesmo.',
    buttonLabel: 'Entrar'
  }
};

// Alterna entre os modos "login" e "cadastro".
// Só precisa ligar/desligar uma classe no container — toda a animação
// (deslizar os painéis e trocar os formulários) é feita pelo CSS.
function toggleMode() {
  const isSignup = splitContainer.classList.toggle('mode-signup');
  const state = isSignup ? CONTENT.signup : CONTENT.login;

  welcomeSubtitle.textContent = state.subtitle;
  toggleModeBtn.textContent = state.buttonLabel;

  clearMessage(loginMessage);
  clearMessage(signupMessage);
}

toggleModeBtn.addEventListener('click', toggleMode);

// --- Helpers para exibir feedback (erro/sucesso) abaixo dos campos ---
function showMessage(element, text, type) {
  element.textContent = text;
  element.className = `form-message ${type}`;
}

function clearMessage(element) {
  element.textContent = '';
  element.className = 'form-message';
}

// --- Envio do formulário de login ---
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // impede o recarregamento padrão da página

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(loginMessage, data.message, 'error');
      return;
    }

    showMessage(loginMessage, data.message, 'success');
    loginForm.reset();

    // Login deu certo: o servidor já criou a sessão, então manda pra área logada
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 600);
  } catch (error) {
    showMessage(loginMessage, 'Não foi possível conectar ao servidor.', 'error');
  }
});

// --- Envio do formulário de cadastro ---
signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  // Validação rápida no cliente (feedback instantâneo); o servidor sempre valida de novo
  if (password !== confirmPassword) {
    showMessage(signupMessage, 'As senhas não coincidem.', 'error');
    return;
  }

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(signupMessage, data.message, 'error');
      return;
    }

    showMessage(signupMessage, data.message, 'success');
    signupForm.reset();

    // Depois de criar a conta, volta para a tela de login automaticamente
    setTimeout(toggleMode, 1200);
  } catch (error) {
    showMessage(signupMessage, 'Não foi possível conectar ao servidor.', 'error');
  }
});
