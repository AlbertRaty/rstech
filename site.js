const preview = document.querySelector('#preview-screen');
const previewButtons = [...document.querySelectorAll('.view-select button')];
for (const button of previewButtons) {
  button.addEventListener('click', () => {
    for (const option of previewButtons) option.setAttribute('aria-pressed', String(option === button));
    preview.src = button.dataset.view;
    preview.alt = document.documentElement.lang === 'es'
      ? 'Vista de prueba de System Pulse Pro. Pantalla ' + button.dataset.label + '.'
      : 'System Pulse Pro preview. ' + button.dataset.label + ' view.';
  });
}

const cards = [...document.querySelectorAll('.product')];
const filters = [...document.querySelectorAll('[data-filter]')];
for (const filter of filters) {
  filter.addEventListener('click', () => {
    for (const button of filters) button.setAttribute('aria-pressed', String(button === filter));
    for (const card of cards) card.hidden = filter.dataset.filter !== 'all' && card.dataset.category !== filter.dataset.filter;
  });
}

const search = document.querySelector('#search-index');
const groups = [...document.querySelectorAll('.index-group')];
const openOnSearch = new Map();
const normalize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
search.addEventListener('input', () => {
  const query = normalize(search.value.trim());
  let total = 0;
  for (const group of groups) {
    const entries = [...group.querySelectorAll('[data-title]')];
    if (query && !openOnSearch.has(group)) openOnSearch.set(group, group.open);
    let matches = 0;
    for (const entry of entries) {
      entry.hidden = !normalize(entry.dataset.title).includes(query);
      if (!entry.hidden) matches++;
    }
    group.hidden = matches === 0;
    group.querySelector('.index-count').textContent = String(matches);
    if (query) group.open = matches > 0;
    else if (openOnSearch.has(group)) group.open = openOnSearch.get(group);
    total += matches;
  }
  if (!query) openOnSearch.clear();
  document.querySelector('#no-projects').hidden = total !== 0;
});
