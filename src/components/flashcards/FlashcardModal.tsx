import { useEffect, useState } from 'react'
import type { TopicNode } from '../../types/study'

type Props = {
  topic: TopicNode | null
  onClose: () => void
}

export function FlashcardModal({ topic, onClose }: Props) {
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
  const card = topic.flashcards[cardIndex]
  const hasMultipleCards = topic.flashcards.length > 1

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="flashcard-modal" role="dialog" aria-modal="true" aria-label={'Flashcards for ' + topic.title} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close flashcards">×</button>
        <p className="eyebrow">FLASHCARD / {topic.title}</p>
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
              <button onClick={() => setCardIndex((cardIndex - 1 + topic.flashcards.length) % topic.flashcards.length)} aria-label="Previous flashcard">←</button>
              <span>{cardIndex + 1} / {topic.flashcards.length}</span>
              <button onClick={() => setCardIndex((cardIndex + 1) % topic.flashcards.length)} aria-label="Next flashcard">→</button>
            </>
          ) : <span>1 CARD</span>}
        </div>
      </section>
    </div>
  )
}
