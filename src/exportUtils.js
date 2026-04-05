// ── Export helpers ────────────────────────────────────────────────────────────

export function exportCSV(transactions) {
  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount']
  const rows = transactions.map(t => [
    t.id,
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
    t.category,
    t.type,
    t.amount,
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  download(csv, 'fintrek-transactions.csv', 'text/csv')
}

export function exportJSON(transactions) {
  const json = JSON.stringify(transactions, null, 2)
  download(json, 'fintrek-transactions.json', 'application/json')
}

function download(content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
