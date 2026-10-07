(() => {
  "use strict";
  const read = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Keep working when storage is disabled. */ } };
  const storedFavorites = read('sapica:favorites', []);
  const favorites = new Set(Array.isArray(storedFavorites) ? storedFavorites.filter(value => typeof value === 'string') : []);
  const cards = [...document.querySelectorAll('[data-dog]')];
  let filter = 'all';
  const update = () => {
    const query = document.getElementById('dog-search').value.trim().toLocaleLowerCase('sr');
    let visible = 0;
    cards.forEach(card => {
      const liked = favorites.has(card.dataset.dog);
      const button = card.querySelector('.favorite');
      button.setAttribute('aria-pressed', String(liked));
      button.setAttribute('aria-label', `${liked ? 'Ukloni iz favorita' : 'Dodaj u favorite'}: ${card.querySelector('h3').textContent}`);
      button.textContent = liked ? '♥' : '♡';
      card.hidden = !card.textContent.toLocaleLowerCase('sr').includes(query) || (filter === 'favorites' && !liked);
      if (!card.hidden) visible++;
    });
    document.getElementById('favorite-count').textContent = favorites.size;
    document.getElementById('catalog-status').textContent = `Prikazano: ${visible} od ${cards.length}`;
    document.getElementById('no-results').hidden = visible !== 0;
  };
  cards.forEach(card => card.querySelector('.favorite').addEventListener('click', () => {
    const slug = card.dataset.dog;
    favorites.has(slug) ? favorites.delete(slug) : favorites.add(slug);
    write('sapica:favorites', [...favorites]); update();
  }));
  document.getElementById('dog-search').addEventListener('input', update);
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    update();
  }));
  const today = () => new Date().toLocaleDateString('sv');
  let date = today();
  const saved = read('sapica:day', {});
  const tasks = [...document.querySelectorAll('[data-task]')];
  const updatePlan = () => {
    const completed = tasks.filter(task => task.checked).map(task => task.dataset.task);
    document.getElementById('day-progress').value = completed.length;
    document.getElementById('day-status').textContent = completed.length === tasks.length ? 'Sve male radosti su na broju. ♡' : `${completed.length} od ${tasks.length} male radosti`;
    write('sapica:day', { date, completed });
  };
  const reset = () => { date = today(); tasks.forEach(task => task.checked = false); updatePlan(); };
  tasks.forEach(task => { task.checked = saved && saved.date === date && Array.isArray(saved.completed) && saved.completed.includes(task.dataset.task); task.addEventListener('change', () => { if (date !== today()) { reset(); return; } updatePlan(); }); });
  document.getElementById('reset-plan').addEventListener('click', reset);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && date !== today()) reset(); });
  const activities = [
    ['Nova ruta kroz poznati kraj', 'Sledeću šetnju počnite drugom ulicom i otkrijte nešto novo zajedno.'],
    ['Portret najboljeg prijatelja', 'Pronađi lepo svetlo u sobi i zabeleži jednu veselu njušku.'],
    ['Kutak za predah', 'Pripremi mirno mesto i odvoji malo vremena da samo budete zajedno.'],
    ['Omiljena igra, novi trenutak', 'Uzmi poznatu igračku i posveti svom drugaru nekoliko minuta pune pažnje.'],
    ['Mala šetnja bez telefona', 'Ostavi ekran u džepu i uživaj u svetu koji vaš drugar primećuje.']
  ];
  let activity = 0;
  document.getElementById('next-activity').addEventListener('click', () => { activity = (activity + 1) % activities.length; document.getElementById('activity-title').textContent = activities[activity][0]; document.getElementById('activity-description').textContent = activities[activity][1]; });
  update(); updatePlan();
})();
