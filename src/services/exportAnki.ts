import type { Flashcard, TopicNode } from '../types/study'

function escapeCsv(value: string) {
  return '"' + value.replace(/"/g, '""') + '"'
}

function collectFlashcards(node: TopicNode): Flashcard[] {
  return [...node.flashcards, ...node.children.flatMap(collectFlashcards)]
}

/** Downloads every generated flashcard as a UTF-8 CSV Anki can import. */
export function exportTreeToAnki(tree: TopicNode) {
  const rows = collectFlashcards(tree).map((card) => [
    escapeCsv(card.question),
    escapeCsv(card.answer),
  ].join(','))
  const csv = ['#separator:Comma', 'Question,Answer', ...rows].join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const fileName = tree.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  link.href = url
  link.download = (fileName || 'saplings-flashcards') + '-anki.csv'
  link.click()
  URL.revokeObjectURL(url)
}
