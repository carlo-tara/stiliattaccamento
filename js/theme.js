// Theme Toggle - Dark/Light Mode

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update toggle button text
  const toggleBtn = document.querySelector('.theme-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = newTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
  }
}

// Initialize theme toggle button
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.theme-toggle');
  if (toggleBtn) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    toggleBtn.textContent = currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    toggleBtn.addEventListener('click', toggleTheme);
  }
});

