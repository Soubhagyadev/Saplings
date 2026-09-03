import type { TopicNode } from '../types/study'

export async function generateStudyTree(sourceText: string): Promise<TopicNode> {
  let response: Response
  try {
    response = await fetch('/api/generate-tree', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceText }),
    })
  } catch {
    throw new Error('Cannot reach the AI server. Start it with: python3 -m uvicorn server.app:app --reload')
  }

  const rawBody = await response.text()
  let body: { tree?: TopicNode; detail?: string }
  try {
    body = JSON.parse(rawBody) as { tree?: TopicNode; detail?: string }
  } catch {
    throw new Error('The AI server returned an empty response. Make sure the Python server is running on port 8000.')
  }
  if (!response.ok || !body.tree) {
    throw new Error(body.detail ?? 'Gemini could not generate a topic tree.')
  }
  return body.tree
}
