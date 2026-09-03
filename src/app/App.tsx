import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { extractPdfText } from '../services/parsePdf'

type ImportStatus = 'idle' | 'parsing' | 'ready' | 'error'

export function App() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<ImportStatus>('idle')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

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
            <span>{status === 'parsing' && 'READING YOUR PDF…'}{status === 'ready' && text.length.toLocaleString() + ' CHARACTERS READY FOR AI'}{status === 'error' && error}</span>
          </div>
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
    </main>
  )
}
