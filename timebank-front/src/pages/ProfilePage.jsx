import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMyProfile, updateMyProfile } from '../services/profileService'

export default function ProfilePage() {
  const { token, login } = useAuth()

  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile()
        setForm({
          name: data.name || '',
          surname: data.surname || '',
          email: data.email || '',
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setSaving(true)

    try {
      const updatedUser = await updateMyProfile(form)
      login(token, updatedUser)
      setMessage('Perfil actualizado correctamente')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="page-center">Cargando perfil...</div>
  }

  return (
    <div className="page-center">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h1>Mi perfil</h1>

        <label>Nombre</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>Apellidos</label>
        <input name="surname" value={form.surname} onChange={handleChange} />

        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />

        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}

        <button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}