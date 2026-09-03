import { useState } from 'react'
import type { TopicNode } from '../../types/study'

type Props = {
  tree: TopicNode
  onOpenCards: (topic: TopicNode) => void
}

export function TopicTree({ tree, onOpenCards }: Props) {
  return <div className="topic-tree"><TreeNode node={tree} level={0} onOpenCards={onOpenCards} /></div>
}

function TreeNode({ node, level, onOpenCards }: { node: TopicNode; level: number; onOpenCards: (topic: TopicNode) => void }) {
  const [isOpen, setIsOpen] = useState(true)
  const hasChildren = node.children.length > 0
  const cardCount = node.flashcards.length

  return (
    <div className={'tree-node level-' + Math.min(level, 2)}>
      <div className="tree-row">
        <button
          className="tree-box"
          onClick={() => cardCount > 0 && onOpenCards(node)}
          disabled={cardCount === 0}
          title={cardCount > 0 ? node.flashcards[0].question : 'This topic has no cards yet'}
        >
          {hasChildren && (
            <span className="expand-toggle" onClick={(event) => { event.stopPropagation(); setIsOpen(!isOpen) }} role="button" tabIndex={0} aria-label={isOpen ? 'Collapse topic' : 'Expand topic'}>
              {isOpen ? '−' : '+'}
            </span>
          )}
          <span className="tree-title">{node.title}</span>
          {cardCount > 0 && <span className="card-count">{cardCount} {cardCount === 1 ? 'CARD' : 'CARDS'}</span>}
          {cardCount > 0 && <span className="hover-card">HOVER: {node.flashcards[0].question}</span>}
        </button>
      </div>
      {hasChildren && isOpen && <div className="tree-children">{node.children.map((child) => <TreeNode key={child.id} node={child} level={level + 1} onOpenCards={onOpenCards} />)}</div>}
    </div>
  )
}
