// UI wiring: tabs, inputs, preview, sequence numbers and download.
// Depends on config.js (TABS, UUID_RE) and csv.js (parseRows, buildCsv, buildFilename, todayLocal).

const inputEl = document.getElementById('input');
const dateEl = document.getElementById('date');
const seqEl = document.getElementById('seq');
const subtitleEl = document.getElementById('subtitle');
const hintEl = document.getElementById('hint');
const filenamePreviewEl = document.getElementById('filenamePreview');
const errorEl = document.getElementById('error');
const countEl = document.getElementById('count');
const downloadBtn = document.getElementById('downloadBtn');
const previewPanel = document.getElementById('previewPanel');
const previewTable = document.getElementById('previewTable');
const tabButtons = document.querySelectorAll('.tab');

let activeTab = 'cancel';
const drafts = { cancel: '', eligibility: '' };

function currentTab() {
  return TABS[activeTab];
}

function storageKey(yyyymmdd) {
  return `${currentTab().seqKeyPrefix}_${yyyymmdd}`;
}

function initSequenceForToday() {
  const iso = todayLocal();
  dateEl.value = iso;
  const stored = localStorage.getItem(storageKey(iso.replaceAll('-', '')));
  seqEl.value = stored ? parseInt(stored, 10) + 1 : 1;
}

function renderTab() {
  const tab = currentTab();
  tabButtons.forEach(btn => {
    const isActive = btn.dataset.tab === activeTab;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
  subtitleEl.textContent = `Paste rows copied from DBeaver (${tab.columns.join(', ')}) and download a CSV ready to upload into tide-web-apps' ${tab.screen} screen.`;
  hintEl.innerHTML = `Expected column order per row: <strong>${tab.columns.join(', ')}</strong>. Copy-paste straight from DBeaver's grid (tab-separated) or a CSV export (comma-separated) — both are auto-detected. Blank lines are ignored.`;
  inputEl.placeholder = tab.placeholder;
}

function switchTab(tab) {
  if (tab === activeTab) return;
  drafts[activeTab] = inputEl.value;
  activeTab = tab;
  inputEl.value = drafts[activeTab];
  renderTab();
  initSequenceForToday();
  update();
}

function renderPreview(rows) {
  if (rows.length === 0) {
    previewPanel.style.display = 'none';
    return;
  }
  previewPanel.style.display = 'block';
  const headerRow = `<tr>${currentTab().columns.map(c => `<th>${c}</th>`).join('')}</tr>`;
  const bodyRows = rows.map(r => `<tr>${r.map(v => `<td>${v}</td>`).join('')}</tr>`).join('');
  previewTable.innerHTML = headerRow + bodyRows;
}

function currentFilename() {
  return buildFilename(currentTab(), dateEl.value || todayLocal(), seqEl.value);
}

function update() {
  const { rows, errors } = parseRows(inputEl.value, currentTab());

  filenamePreviewEl.textContent = rows.length > 0 ? currentFilename() : '';
  errorEl.textContent = errors.length > 0 ? errors.join('\n') : '';
  countEl.textContent = rows.length > 0 ? `${rows.length} row(s) ready` : '';
  downloadBtn.disabled = rows.length === 0 || errors.length > 0;

  renderPreview(rows);
}

function download() {
  const { rows, errors } = parseRows(inputEl.value, currentTab());
  if (rows.length === 0 || errors.length > 0) return;

  const csv = buildCsv(rows, currentTab());
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = currentFilename();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const yyyymmdd = (dateEl.value || todayLocal()).replaceAll('-', '');
  const seq = parseInt(seqEl.value || '1', 10);
  localStorage.setItem(storageKey(yyyymmdd), String(seq));
  seqEl.value = seq + 1;
  filenamePreviewEl.textContent = currentFilename();
}

tabButtons.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
downloadBtn.addEventListener('click', download);
inputEl.addEventListener('input', update);
dateEl.addEventListener('change', update);
seqEl.addEventListener('input', update);

renderTab();
initSequenceForToday();
update();
