import { useEffect, useState } from 'react'
import type { TopicNode } from '../../types/study'

type Props = {
  topic: TopicNode | null
  onClose: () => void
  viewCounts: Record<string, number>
  onViewCard: (cardKey: string) => void
}

export function FlashcardModal({ topic, onClose, viewCounts, onViewCard }: Props) {
  const [cardIndex, setCardIndex] = useState(0)

  useEffect(() => setCardIndex(0), [topic])
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  if (!topic || topic.flashcards.length === 0) return null
  const openedTopic = topic
  const card = openedTopic.flashcards[cardIndex]
  const hasMultipleCards = openedTopic.flashcards.length > 1
  const cardKey = openedTopic.id + '-' + cardIndex
  const viewCount = viewCounts[cardKey] ?? 0

  function selectCard(nextIndex: number) {
    const normalizedIndex = (nextIndex + openedTopic.flashcards.length) % openedTopic.flashcards.length
    onViewCard(openedTopic.id + '-' + normalizedIndex)
    setCardIndex(normalizedIndex)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="flashcard-modal" role="dialog" aria-modal="true" aria-label={'Flashcards for ' + openedTopic.title} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close flashcards">×</button>
        <p className="eyebrow">FLASHCARD / {openedTopic.title}</p>
        <div className="flashcard">
          <span className="card-label">QUESTION</span>
          <h3>{card.question}</h3>
          <div className="card-divider" />
          <span className="card-label">ANSWER</span>
          <p>{card.answer}</p>
        </div>
        <div className="card-controls">
          {hasMultipleCards ? (
            <>
              <button onClick={() => selectCard(cardIndex - 1)} aria-label="Previous flashcard">←</button>
              <span>{cardIndex + 1} / {openedTopic.flashcards.length}</span>
              <button onClick={() => selectCard(cardIndex + 1)} aria-label="Next flashcard">→</button>
            </>
          ) : <span>1 CARD</span>}
        </div>
        <p className="view-status">
          <span>✓</span> VIEWED {viewCount} {viewCount === 1 ? 'TIME' : 'TIMES'}
        </p>
      </section>
    </div>
  )
}
