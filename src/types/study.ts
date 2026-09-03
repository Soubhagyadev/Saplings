export type Flashcard = {
  question: string
  answer: string
}

export type TopicNode = {
  id: string
  title: string
  flashcards: Flashcard[]
  children: TopicNode[]
}
