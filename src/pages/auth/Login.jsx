import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ email:'', password:'', schoolId:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email requis'
    if (!form.password) e.password = 'Mot de passe requis'
    if (!form.schoolId) e.schoolId = 'ID ecole requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const upd = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    setErrors(p => ({ ...p, [k]: '' }))
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError('')
    try {
      const { data } = await api.post('/v1/auth/login', {
        email: form.email,
        password: form.password,
        schoolId: form.schoolId,
      })
      if (data.success) {
        login(data.data)
        navigate('/dashboard')
      } else {
        setApiError(data.message || 'Email ou mot de passe incorrect')
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = async () => {
    setLoading(true)
    setApiError('')
    try {
      const { data } = await api.post('/v1/auth/login', {
        email: 'admin@lyceetech.sn',
        password: 'Admin1234!',
        schoolId: '75deeec4-cbf8-41c6-a6a1-96354d185941',
      })
      if (data.success) {
        login(data.data)
        navigate('/dashboard')
      } else {
        setApiError(data.message || 'Email ou mot de passe incorrect')
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{background:'#f0faf5'}}>
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#1D9E75] flex items-center justify-center text-white font-bold text-lg">E</div>
          <span className="text-white font-bold text-xl">Edukira<span className="text-[#1D9E75]">.</span></span>
        </div>
        <h1 className="text-white font-extrabold text-4xl leading-tight mb-4">Votre école<br/>digitalisée.<br/><span className="text-[#1D9E75]">Zéro papier. Zéro stress.</span></h1>
        <p className="text-white/60 text-sm">Élèves, notes, présences et paiements dans une seule plateforme.</p>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{background:'#0f172a'}}>
        <div className="w-full max-w-md">
          <h2 className="text-white font-bold text-3xl mb-1">Bon retour </h2>
          <p className="text-white/50 text-sm mb-8">Connectez-vous à votre espace école</p>
          {apiError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4" style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5',fontSize:'13px'}}>
               {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-white/45">EMAIL</label>
              <input type="email" value={form.email} onChange={upd('email')} placeholder="directeur@ecole.sn"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none text-white placeholder-white/25"
                style={{background:'rgba(255,255,255,0.06)',border:errors.email?'1px solid #f87171':'1px solid rgba(255,255,255,0.12)'}}/>
              {errors.email && <p className="text-red-400 text-xs mt-1"> {errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-white/45">MOT DE PASSE</label>
              <input type="password" value={form.password} onChange={upd('password')} placeholder=""
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none text-white placeholder-white/25"
                style={{background:'rgba(255,255,255,0.06)',border:errors.password?'1px solid #f87171':'1px solid rgba(255,255,255,0.12)'}}/>
              {errors.password && <p className="text-red-400 text-xs mt-1"> {errors.password}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-white/45">ID DE L'ÉCOLE</label>
              <input type="text" value={form.schoolId} onChange={upd('schoolId')} placeholder="97c55f47-71e1-443d-..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono outline-none text-white placeholder-white/25"
                style={{background:'rgba(255,255,255,0.06)',border:errors.schoolId?'1px solid #f87171':'1px solid rgba(255,255,255,0.12)'}}/>
              {errors.schoolId && <p className="text-red-400 text-xs mt-1"> {errors.schoolId}</p>}
              <p className="text-white/25 text-xs mt-1">Disponible dans votre email d'activation</p>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
              style={{background:loading?'#6B7280':'#1D9E75'}}>
              {loading ? ' Connexion...' : ' Se connecter'}
            </button>
          </form>
          <p className="text-center text-sm text-white/40 mt-4">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-[#1D9E75] font-semibold no-underline hover:underline">Inscrire votre école </Link>
          </p>
          <div className="px-4 py-3 rounded-xl mt-4" style={{background:'rgba(29,158,117,0.12)',border:'1px solid rgba(29,158,117,0.3)'}}>
            <p className="text-xs font-semibold text-[#1D9E75] mb-1">Compte de test</p>
            <button onClick={fillDemo} disabled={loading} className="text-xs text-[#1D9E75]/80 bg-transparent border-none cursor-pointer underline p-0 hover:text-[#1D9E75]">
              Remplir automatiquement 
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

