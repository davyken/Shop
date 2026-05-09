import { useState, useRef } from 'react'
import { FiCamera, FiUpload, FiSave, FiLock } from 'react-icons/fi'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import DashLayout from '../components/DashLayout'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import './Profile.css'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', username: user?.username || '', email: user?.email || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [saving, setSaving] = useState(false)
  const [changingPw, setChangingPw] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(user?.profilePic || '')
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef()
  const streamRef = useRef()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put('/api/users/profile', form)
      updateUser(data.user)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    }
    setSaving(false)
  }

  const uploadPic = async (file) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('profilePic', file)
    try {
      const { data } = await api.post('/api/users/profile/picture', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setPreview(data.profilePic)
      updateUser({ profilePic: data.profilePic })
      toast.success('Profile picture updated! 🎉')
    } catch {
      toast.error('Failed to upload image')
    }
    setUploading(false)
  }

  const handleFileInput = (e) => { if (e.target.files[0]) uploadPic(e.target.files[0]) }

  const startCamera = async () => {
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch {
      toast.error('Camera not available')
      setShowCamera(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    setShowCamera(false)
  }

  const snapPhoto = () => {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    canvas.toBlob((blob) => {
      const file = new File([blob], 'profile-snap.jpg', { type: 'image/jpeg' })
      uploadPic(file)
      stopCamera()
    }, 'image/jpeg', 0.92)
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match')
    setChangingPw(true)
    try {
      await api.put('/api/users/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed!')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
    setChangingPw(false)
  }

  return (
    <DashLayout title="My Profile">
      <div className="profile-page">
        {/* Avatar section */}
        <div className="card profile-avatar-card">
          <div className="avatar-section">
            <div className="avatar-wrap">
              {preview
                ? <img src={preview} alt="profile" className="avatar avatar-xl" />
                : <div className="avatar avatar-xl">{user?.name?.[0]?.toUpperCase()}</div>}
              {uploading && <div className="avatar-overlay"><span className="spinner" /></div>}
            </div>
            <div>
              <h2>{user?.name}</h2>
              <p className="text-muted">@{user?.username}</p>
              <p className="text-muted">{user?.email}</p>
              <div className="avatar-actions">
                <label className="btn btn-ghost btn-sm" htmlFor="picInput"><FiUpload /> Upload</label>
                <input id="picInput" type="file" accept="image/*" hidden onChange={handleFileInput} />
                <button className="btn btn-secondary btn-sm" onClick={showCamera ? stopCamera : startCamera}>
                  <FiCamera /> {showCamera ? 'Stop' : 'Camera'}
                </button>
              </div>
            </div>
          </div>
          {showCamera && (
            <div className="camera-section">
              <video ref={videoRef} autoPlay playsInline className="camera-preview" />
              <button className="btn btn-primary" onClick={snapPhoto}><FiCamera /> Snap Photo</button>
            </div>
          )}
        </div>

        <div className="profile-grid">
          {/* Edit profile form */}
          <div className="card">
            <h3 className="pf-section-title">Edit Profile</h3>
            <form onSubmit={saveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="name" className="form-input" value={form.name} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input name="username" className="form-input" value={form.username} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-input" value={form.email} onChange={handle} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="spinner" /> : <><FiSave /> Save Changes</>}
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="card">
            <h3 className="pf-section-title"><FiLock /> Change Password</h3>
            <form onSubmit={changePassword}>
              {['currentPassword', 'newPassword', 'confirm'].map((field, i) => (
                <div className="form-group" key={field}>
                  <label className="form-label">{['Current Password','New Password','Confirm New Password'][i]}</label>
                  <div className="input-wrap">
                    <input name={field} type={showPw ? 'text' : 'password'} className="form-input"
                      value={pwForm[field]} onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })} required />
                    {i === 0 && (
                      <button type="button" className="input-icon" onClick={() => setShowPw(!showPw)}>
                        {showPw ? <FiEyeOff /> : <FiEye />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="submit" className="btn btn-secondary" disabled={changingPw}>
                {changingPw ? <span className="spinner" /> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashLayout>
  )
}
