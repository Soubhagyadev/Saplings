import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FlashcardModal } from '../components/flashcards/FlashcardModal'
import { TopicTree } from '../components/tree/TopicTree'
import { extractPdfText } from '../services/parsePdf'
import { generateStudyTree } from '../services/studyTree'
import type { TopicNode } from '../types/study'

type ImportStatus = 'idle' | 'parsing' | 'ready' | 'generating' | 'error'

export function App() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<ImportStatus>('idle')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [tree, setTree] = useState<TopicNode | null>(null)
  const [activeTopic, setActiveTopic] = useState<TopicNode | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const totalCharacterCount = Array.from(text).length

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  async function handleFile(fileToImport: File) {
    if (fileToImport.type !== 'application/pdf') {
      setError('Please choose a PDF file.')
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(fileToImport)
    setPreviewUrl(URL.createObjectURL(fileToImport))
    setStatus('parsing')
    setError('')
    setText('')
    setTree(null)
    setActiveTopic(null)

    try {
      const extractedText = await extractPdfText(fileToImport)
      setText(extractedText)
      setStatus('ready')
    } catch {
      setStatus('error')
      setError('We could not read this PDF. Try another file.')
    }
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) void handleFile(selectedFile)
  }

  async function handleGenerateTree() {
    if (!text) return
    setStatus('generating')
    setError('')
    try {
      setTree(await generateStudyTree(text))
      setStatus('ready')
    } catch (generationError) {
      setStatus('error')
      setError(generationError instanceof Error ? generationError.message : 'Could not generate the study tree.')
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Saplings home">
          <span className="brand-mark">S</span>
          <span>SAPLINGS</span>
        </a>
        <p>GROW YOUR KNOWLEDGE</p>
        <button className="profile-button" aria-label="Open profile">SS</button>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">01 / PLANT A SOURCE</p>
          <h1>TURN NOTES INTO<br /><em>KNOWLEDGE.</em></h1>
          <p className="intro">Drop in a lecture PDF. We’ll find the branches, then grow study cards from the source.</p>
        </div>
        <div className="hero-sticker" aria-hidden="true">
          <span>✦</span><strong>LEARN<br />LOUDLY</strong>
        </div>
      </section>

      <section className="import-section" aria-labelledby="import-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR SOURCE</p>
            <h2 id="import-title">IMPORT A PDF</h2>
          </div>
          <span className="step-label">STEP 1 OF 3</span>
        </div>

        <input ref={inputRef} className="sr-only" type="file" accept="application/pdf" onChange={onFileChange} />
        <button className="dropzone" onClick={() => inputRef.current?.click()}>
          <span className="upload-icon">↥</span>
          <span className="dropzone-copy">
            <strong>{file ? file.name : 'DROP YOUR PDF HERE'}</strong>
            <small>{file ? Math.ceil(file.size / 1024) + ' KB · click to replace' : 'or click to browse files'}</small>
          </span>
          <span className="browse-button">BROWSE</span>
        </button>

        {status !== 'idle' && (
          <div className={'parse-status ' + status}>
            <span className="status-dot" />
            <span>{status === 'parsing' && 'READING YOUR PDF…'}{status === 'generating' && 'GROWING YOUR TOPIC TREE WITH GEMINI…'}{status === 'ready' && 'TOTAL EXTRACTED: ' + totalCharacterCount.toLocaleString() + ' CHARACTERS'}{status === 'error' && error}</span>
          </div>
        )}
        {status === 'ready' && !tree && (
          <button className="generate-button" onClick={() => void handleGenerateTree()}>
            GROW MY STUDY TREE <span>→</span>
          </button>
        )}
      </section>

      <section className="preview-section" aria-labelledby="preview-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SOURCE PREVIEW</p>
            <h2 id="preview-title">YOUR DOCUMENT</h2>
          </div>
          {file && <span className="page-tag">PDF</span>}
        </div>

        <div className={'pdf-frame ' + (previewUrl ? 'has-file' : '')}>
          {previewUrl ? (
            <iframe title={'Preview of ' + (file?.name ?? 'PDF')} src={previewUrl} />
          ) : (
            <div className="empty-preview">
              <span>⌁</span>
              <p>YOUR PDF WILL LIVE HERE.</p>
              <small>Import a source to preview it before growing your study tree.</small>
            </div>
          )}
        </div>
      </section>

      {tree && (
        <section className="tree-section" aria-labelledby="tree-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / EXPLORE THE BRANCHES</p>
              <h2 id="tree-title">TOPIC TREE</h2>
            </div>
            <button className="regenerate-button" onClick={() => void handleGenerateTree()}>REGENERATE</button>
          </div>
          <p className="tree-guide">HOVER A BOX TO PREVIEW A CARD. CLICK A BOX TO STUDY. USE + / − TO TOGGLE BRANCHES.</p>
          <TopicTree tree={tree} onOpenCards={setActiveTopic} />
        </section>
      )}

      <FlashcardModal topic={activeTopic} onClose={() => setActiveTopic(null)} />
    </main>
  )
}
