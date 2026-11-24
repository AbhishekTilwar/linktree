import { useState, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, Pencil, Trash2, X } from 'lucide-react'
import type { LinkItem, Profile } from '../types'

type Props = {
  profile: Profile
  links: LinkItem[]
  onClose: () => void
  onUpdateProfile: (profile: Profile) => void
  onAddLink: (title: string, url: string) => void
  onUpdateLink: (id: string, title: string, url: string) => void
  onDeleteLink: (id: string) => void
  onMoveLink: (id: string, direction: 'up' | 'down') => void
  onReset: () => void
  onExport: () => void
}

function normalizeUrl(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function AdminPanel({
  profile,
  links,
  onClose,
  onUpdateProfile,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onMoveLink,
  onReset,
  onExport,
}: Props) {
  const [name, setName] = useState(profile.name)
  const [bio, setBio] = useState(profile.bio)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  const saveProfile = (event: FormEvent) => {
    event.preventDefault()
    onUpdateProfile({
      name: name.trim() || 'Your Name',
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
    })
  }

  const saveLink = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !url.trim()) {
      setFormError('Title and URL are required.')
      return
    }
    const finalUrl = normalizeUrl(url)
    if (editingId) {
      onUpdateLink(editingId, title, finalUrl)
    } else {
      onAddLink(title, finalUrl)
    }
    setTitle('')
    setUrl('')
    setEditingId(null)
    setFormError('')
  }

  const startEdit = (link: LinkItem) => {
    setEditingId(link.id)
    setTitle(link.title)
    setUrl(link.url)
    setFormError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setUrl('')
    setFormError('')
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="admin-title">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 id="admin-title">Your links</h2>
            <p>Saved here instantly. Export links.json into /public and redeploy for everyone.</p>
          </div>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form className="form" onSubmit={saveProfile}>
          <div className="field">
            <label htmlFor="name">Display name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="avatar">Avatar image URL (optional)</label>
            <input
              id="avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="actions">
            <button className="btn btn-primary" type="submit">
              Save profile
            </button>
          </div>
        </form>

        <h3 className="section-title">{editingId ? 'Edit link' : 'Add a link'}</h3>
        <form className="form" onSubmit={saveLink}>
          <div className="field">
            <label htmlFor="link-title">Title</label>
            <input
              id="link-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Portfolio"
            />
          </div>
          <div className="field">
            <label htmlFor="link-url">URL</label>
            <input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yoursite.com"
            />
          </div>
          {formError ? <p className="error">{formError}</p> : null}
          <div className="actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Update link' : 'Add link'}
            </button>
            {editingId ? (
              <button className="btn btn-secondary" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <h3 className="section-title">Current links</h3>
        {links.length === 0 ? (
          <div className="empty">No links yet. Add your first one above.</div>
        ) : (
          <div className="admin-links">
            {links.map((link, index) => (
              <div className="admin-link" key={link.id}>
                <div className="admin-link-meta">
                  <strong>{link.title}</strong>
                  <span>{link.url}</span>
                </div>
                <div className="admin-link-actions">
                  <button
                    className="icon-btn"
                    type="button"
                    aria-label="Move up"
                    disabled={index === 0}
                    onClick={() => onMoveLink(link.id, 'up')}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    type="button"
                    aria-label="Move down"
                    disabled={index === links.length - 1}
                    onClick={() => onMoveLink(link.id, 'down')}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    type="button"
                    aria-label="Edit"
                    onClick={() => startEdit(link)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    type="button"
                    aria-label="Delete"
                    onClick={() => onDeleteLink(link.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="actions" style={{ marginTop: '1.25rem' }}>
          <button className="btn btn-primary" type="button" onClick={onExport}>
            Export links.json
          </button>
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Done
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => {
              if (confirm('Reset to default profile and links?')) onReset()
            }}
          >
            Reset defaults
          </button>
        </div>
      </div>
    </div>
  )
}
