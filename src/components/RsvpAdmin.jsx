import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function RsvpAdmin({ onClose }) {
  const [pin, setPin] = useState(() => sessionStorage.getItem('rsvp_admin_pin') || '')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(null)
  
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Editing state
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', attending: 'yes', guests: '1', message: '' })

  // Verify PIN if we already have it in sessionStorage
  useEffect(() => {
    if (pin) {
      verifyPin(pin)
    }
  }, [])

  function verifyPin(pinToVerify) {
    setLoading(true)
    setPinError(null)
    fetch(`api/rsvp.php?action=verify_pin&pin=${encodeURIComponent(pinToVerify)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Incorrect PIN')
        return res.json()
      })
      .then((data) => {
        if (data.success) {
          setPin(pinToVerify)
          sessionStorage.setItem('rsvp_admin_pin', pinToVerify)
          setIsAuthorized(true)
          fetchRsvps(pinToVerify)
        } else {
          throw new Error('Incorrect PIN')
        }
      })
      .catch((err) => {
        setPinError('Invalid PIN code. Please try again.')
        sessionStorage.removeItem('rsvp_admin_pin')
        setPin('')
        setLoading(false)
      })
  }

  function fetchRsvps(activePin = pin) {
    setLoading(true)
    setError(null)
    fetch('api/rsvp.php?action=list', {
      headers: {
        'X-Admin-PIN': activePin
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch RSVPs')
        return res.json()
      })
      .then((data) => {
        setRsvps(data)
      })
      .catch((err) => {
        setError('Failed to load guest list. Please try again.')
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function handlePinSubmit(e) {
    e.preventDefault()
    if (!pinInput.trim()) return
    verifyPin(pinInput.trim())
  }

  function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete ${name}'s RSVP?`)) return
    
    setLoading(true)
    fetch('api/rsvp.php?action=delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-PIN': pin
      },
      body: JSON.stringify({ id })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete RSVP')
        return res.json()
      })
      .then(() => {
        setRsvps((prev) => prev.filter((r) => r.id !== id))
        if (editingId === id) setEditingId(null)
      })
      .catch((err) => {
        alert(err.message || 'Error deleting RSVP')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function handleStartEdit(rsvp) {
    setEditingId(rsvp.id)
    setEditForm({
      name: rsvp.name,
      email: rsvp.email,
      attending: rsvp.attending,
      guests: String(rsvp.guests || 1),
      message: rsvp.message || ''
    })
  }

  function handleSaveEdit(e) {
    e.preventDefault()
    if (!editForm.name.trim() || !editForm.email.trim()) {
      alert('Name and Email are required.')
      return
    }

    setLoading(true)
    fetch('api/rsvp.php?action=update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-PIN': pin
      },
      body: JSON.stringify({
        id: editingId,
        ...editForm,
        guests: editForm.attending === 'no' ? 0 : Number(editForm.guests)
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update RSVP')
        return res.json()
      })
      .then(() => {
        setRsvps((prev) =>
          prev.map((r) =>
            r.id === editingId
              ? {
                  ...r,
                  ...editForm,
                  guests: editForm.attending === 'no' ? 0 : Number(editForm.guests),
                  last_updated: new Date().toISOString().slice(0, 19).replace('T', ' ')
                }
              : r
          )
        )
        setEditingId(null)
      })
      .catch((err) => {
        alert(err.message || 'Error updating RSVP')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function handleLogout() {
    sessionStorage.removeItem('rsvp_admin_pin')
    setPin('')
    setIsAuthorized(false)
    setRsvps([])
  }

  function handleExportCSV() {
    if (rsvps.length === 0) return
    const headers = ['Name', 'Email', 'Attending', 'Guests', 'Message', 'Date Submitted']
    
    // Create Excel Spreadsheet XML/HTML with explicit styling and column widths
    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>RSVP Guest List</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; }
          th { background-color: #f0c0e8; font-weight: bold; border: 1px solid #d4d4d4; padding: 8px; font-family: sans-serif; font-size: 11pt; }
          td { border: 1px solid #d4d4d4; padding: 8px; font-family: sans-serif; font-size: 10pt; vertical-align: top; }
        </style>
      </head>
      <body>
        <table>
          <colgroup>
            <col width="220" /> <!-- Name -->
            <col width="260" /> <!-- Email -->
            <col width="110" /> <!-- Attending -->
            <col width="90" />  <!-- Guests -->
            <col width="400" /> <!-- Message -->
            <col width="180" /> <!-- Date Submitted -->
          </colgroup>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rsvps.map(r => `
              <tr>
                <td>${(r.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
                <td>${(r.email || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
                <td style="text-align: center;">${r.attending === 'yes' ? 'Yes' : 'No'}</td>
                <td style="text-align: center;">${r.attending === 'yes' ? r.guests : 0}</td>
                <td>${(r.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
                <td style="text-align: center;">${r.timestamp || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rsvp_guest_list_${new Date().toISOString().split('T')[0]}.xls`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Summary stats
  const totalResponses = rsvps.length
  const attendingCount = rsvps.filter((r) => r.attending === 'yes').length
  const totalGuests = rsvps.reduce((sum, r) => sum + (r.attending === 'yes' ? Number(r.guests || 1) : 0), 0)
  const declinedCount = rsvps.filter((r) => r.attending === 'no').length

  if (!isAuthorized) {
    return createPortal(
      <div className="admin-overlay active">
        <div className="admin-modal admin-login-card">
          <button className="admin-close-btn" onClick={onClose} aria-label="Close Admin Panel">&times;</button>
          <h2>RSVP Dashboard</h2>
          <p className="subtitle">Please enter the admin PIN code to view guest list.</p>
          
          <form onSubmit={handlePinSubmit} className="admin-pin-form">
            <div className="field">
              <input
                type="password"
                placeholder="Enter PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                maxLength={8}
                disabled={loading}
                autoFocus
                className="admin-pin-input"
              />
            </div>
            {pinError && <div className="error">{pinError}</div>}
            
            <button type="submit" className="btn btn-primary" disabled={loading || !pinInput}>
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>,
      document.body
    )
  }

  return createPortal(
    <div className="admin-overlay active">
      <div className="admin-modal admin-dashboard-card">
        <header className="admin-header">
          <div>
            <h2>RSVP Admin Dashboard</h2>
            <p className="subtitle">Manage guest list responses and attendance statistics.</p>
          </div>
          <div className="admin-actions">
            <button onClick={handleExportCSV} className="btn btn-secondary btn-sm" disabled={rsvps.length === 0}>
              Export Excel
            </button>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Log Out
            </button>
            <button onClick={onClose} className="btn btn-primary btn-sm">
              Close
            </button>
          </div>
        </header>

        {/* Stats Panel */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-value">{totalResponses}</div>
            <div className="stat-label">Total Responses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-accent">{attendingCount}</div>
            <div className="stat-label">Attending Responses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-gold">{totalGuests}</div>
            <div className="stat-label">Total Guests Count</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{declinedCount}</div>
            <div className="stat-label">Declined</div>
          </div>
        </div>

        {error && <div className="error admin-error">{error}</div>}

        {/* Main List */}
        <div className="admin-table-container">
          {loading && rsvps.length === 0 ? (
            <div className="admin-loading">Loading guest list...</div>
          ) : rsvps.length === 0 ? (
            <div className="admin-empty">No RSVP submissions found yet.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Email Address</th>
                  <th>Attendance</th>
                  <th>Guests</th>
                  <th>Personal Message</th>
                  <th>Submission Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id}>
                    <td>
                      {editingId === rsvp.id ? (
                        <input
                          type="text"
                          className="admin-edit-input"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      ) : (
                        <strong>{rsvp.name}</strong>
                      )}
                    </td>
                    <td>
                      {editingId === rsvp.id ? (
                        <input
                          type="email"
                          className="admin-edit-input"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      ) : (
                        rsvp.email
                      )}
                    </td>
                    <td>
                      {editingId === rsvp.id ? (
                        <select
                          className="admin-edit-input"
                          value={editForm.attending}
                          onChange={(e) => setEditForm({ ...editForm, attending: e.target.value })}
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      ) : (
                        <span className={`status-badge ${rsvp.attending === 'yes' ? 'status-yes' : 'status-no'}`}>
                          {rsvp.attending === 'yes' ? 'Attending' : 'Declined'}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingId === rsvp.id ? (
                        <select
                          className="admin-edit-input"
                          value={editForm.guests}
                          onChange={(e) => setEditForm({ ...editForm, guests: e.target.value })}
                          disabled={editForm.attending === 'no'}
                        >
                          {['1', '2', '3', '4', '5'].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      ) : (
                        rsvp.attending === 'yes' ? rsvp.guests : '0'
                      )}
                    </td>
                    <td>
                      {editingId === rsvp.id ? (
                        <textarea
                          className="admin-edit-input admin-edit-textarea"
                          rows={1}
                          value={editForm.message}
                          onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                        />
                      ) : (
                        <span className="rsvp-message-cell" title={rsvp.message}>
                          {rsvp.message || <em className="text-muted">None</em>}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="rsvp-date-cell">
                        {rsvp.timestamp ? rsvp.timestamp.split(' ')[0] : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        {editingId === rsvp.id ? (
                          <>
                            <button onClick={handleSaveEdit} className="btn btn-primary btn-xs" disabled={loading}>
                              Save
                            </button>
                            <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-xs">
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleStartEdit(rsvp)} className="btn btn-secondary btn-xs">
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(rsvp.id, rsvp.name)}
                              className="btn btn-danger btn-xs"
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
