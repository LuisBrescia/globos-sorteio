export const toggleMenu = () => {
  document.getElementById('menuWrapper').classList.toggle('active');
};

export const changeTheme = () => {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

export const bodyCloseMenu = (event) => {
  if (!event.target.closest('#menuWrapper') && !event.target.closest('#menuButton')) {
    document.getElementById('menuWrapper').classList.remove('active');
  }
};

export const openModal = () => {
  document.getElementById('modal').classList.add('active');
  document.getElementById('menuWrapper').classList.remove('active');
};

export const closeModal = () => {
  document.getElementById('modal').classList.remove('active');
};