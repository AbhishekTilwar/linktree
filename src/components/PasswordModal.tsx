import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { ADMIN_PASSWORD } from '../data/defaults'

type Props = {
  onSuccess: () => void
  onClose: () => void
}

export function PasswordModal({ onSuccess, onClose }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (password === ADMIN_PASSWORD) {
      onSuccess()
      return
    }
    setError('Incorrect password. Try again.')
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 id="auth-title">Manage links</h2>
            <p>Enter the password to add or edit your links.</p>
          </div>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Enter password"
            />
          </div>
          {error ? <p className="error">{error}</p> : null}
          <div className="actions">
            <button className="btn btn-primary" type="submit">
              Unlock
            </button>
            <button className="btn btn-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
