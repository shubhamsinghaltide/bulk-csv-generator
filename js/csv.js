// Pure helpers: parse pasted rows, build CSV text and file names.
// No DOM access, so they can be tested on their own.

/** Splits pasted text into rows of cells, collecting one error per bad line */
function parseRows(raw, tab) {
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const rows = [];
  const errors = [];

  lines.forEach((line, idx) => {
    const parts = line.split(/\t|,/).map(p => p.trim()).filter(p => p.length > 0);
    const cols = parts.length > 1 ? parts : line.split(/\s+/).map(p => p.trim());

    if (cols.length !== tab.columns.length) {
      errors.push(`Line ${idx + 1}: expected ${tab.columns.length} column(s) (${tab.columns.join(', ')}), got ${cols.length} — "${line}"`);
      return;
    }

    tab.uuidColumns.forEach(column => {
      const value = cols[tab.columns.indexOf(column)];
      if (!UUID_RE.test(value)) {
        errors.push(`Line ${idx + 1}: ${column} "${value}" does not look like a UUID`);
      }
    });

    rows.push(cols);
  });

  return { rows, errors };
}

function csvEscape(value) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildCsv(rows, tab) {
  const header = tab.columns.join(',');
  const lines = rows.map(r => r.map(csvEscape).join(','));
  return [header, ...lines].join('\r\n') + '\r\n';
}

function buildFilename(tab, isoDate, seq) {
  const yyyymmdd = isoDate.replaceAll('-', '');
  return `${tab.filePrefix}_${yyyymmdd}_${String(parseInt(seq || '1', 10)).padStart(2, '0')}.csv`;
}

function todayLocal() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
