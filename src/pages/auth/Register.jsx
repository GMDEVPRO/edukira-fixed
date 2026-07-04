import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    schoolName: '',
    schoolType: 'K12',
    country: 'SENEGAL',
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/v1/auth/register', {
        schoolName: form.schoolName,
        schoolType: form.schoolType,
        country: form.country,
        adminName: form.adminName,
        adminEmail: form.adminEmail,
        password: form.password,
      });

      if (data.success || data) {
        toast.success('École enregistrée avec succès! Vérifiez votre email.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '0.5px solid rgba(255,255,255,.12)',
    background: 'rgba(255,255,255,.06)',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif',
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,.45)',
    textTransform: 'uppercase',
    letterSpacing: '.5px',
    marginBottom: 6,
    display: 'block',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0B1E42' }}>
      <style>{`
        .reg-left { display: none; }
        @media (min-width: 1024px) {
          .reg-left {
            display: flex;
            width: 40%;
            flex-direction: column;
            justify-content: space-between;
            padding: 48px;
            background: linear-gradient(135deg, #071430 0%, #0B2254 100%);
            border-right: 1px solid rgba(255,255,255,.05);
            position: sticky; top: 0; height: 100vh;
          }
          .reg-right { flex: 1; padding: 64px !important; }
        }
        input:focus { border-color: #1D9E75 !important; box-shadow: 0 0 0 3px rgba(29,158,117,.1); }
        select:focus { border-color: #1D9E75 !important; }
        .submit-btn:hover { background: #158562 !important; transform: translateY(-1px); }
        .submit-btn:active { transform: translateY(0); }
      `}</style>

      {/* LADO ESQUERDO */}
      <div className="reg-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎓</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>
            Edukira<span style={{ color: '#1D9E75' }}>.</span>
          </span>
        </div>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 20, fontFamily: 'Syne, sans-serif' }}>
            Rejoignez la révolution<br />
            <span style={{ color: '#1D9E75' }}>éducative en Afrique.</span>
          </h1>
          <ul style={{ listStyle: 'none', padding: 0, color: 'rgba(255,255,255,.6)', fontSize: 15 }}>
            <li style={{ marginBottom: 12 }}>✅ Multi-tenant & Sécurisé</li>
            <li style={{ marginBottom: 12 }}>✅ Paiements Mobile Money intégrés</li>
            <li style={{ marginBottom: 12 }}>✅ Communication SMS & WhatsApp</li>
            <li style={{ marginBottom: 12 }}>✅ Marketplace pour enseignants</li>
          </ul>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>© 2026 Edukira · Solution de gestion scolaire intelligente.</p>
      </div>

      {/* LADO DIREITO */}
      <div className="reg-right" style={{ flex: 1, padding: '40px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: 500, width: '100%' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8, fontFamily: 'Syne, sans-serif' }}>
            Inscrire votre école
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', marginBottom: 32 }}>
            Créez votre espace en 2 minutes et commencez à gérer.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Nom de l'établissement</label>
                <input type="text" name="schoolName" required value={form.schoolName} onChange={handleChange} placeholder="Ex: Lycée Technique de Dakar" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Type</label>
                <select name="schoolType" value={form.schoolType} onChange={handleChange} style={inputStyle}>
                  <option value="K12">K-12 (Primaire/Secondaire)</option>
                  <option value="UNIVERSITY">Université / Supérieur</option>
                  <option value="TECHNICAL">Formation Technique</option>
                  <option value="LANGUAGE">École de Langues</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Pays</label>
                <select name="country" value={form.country} onChange={handleChange} style={inputStyle}>
                  <option value="SENEGAL">Sénégal</option>
                  <option value="COTE_IVOIRE">Côte d'Ivoire</option>
                  <option value="MALI">Mali</option>
                  <option value="GUINEA">Guinée</option>
                  <option value="MOROCCO">Maroc</option>
                  <option value="NIGERIA">Nigéria</option>
                </select>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.05)' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Nom complet du Directeur / Admin</label>
                <input type="text" name="adminName" required value={form.adminName} onChange={handleChange} placeholder="Jean Dupont" style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Email professionnel</label>
                <input type="email" name="adminEmail" required value={form.adminEmail} onChange={handleChange} placeholder="admin@ecole.sn" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mot de passe</label>
                <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Confirmer</label>
                <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" style={inputStyle} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
              style={{
                width: '100%', padding: 16, borderRadius: 12, border: 'none',
                background: loading ? '#6B7280' : '#1D9E75',
                color: '#fff', fontSize: 16, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all .3s', fontFamily: 'DM Sans, sans-serif', marginTop: 8,
              }}>
              {loading ? '⏳ Création en cours...' : '🚀 Créer mon école'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,.4)', marginTop: 8 }}>
              Vous avez déjà un compte ?{' '}
              <Link to="/login" style={{ color: '#1D9E75', fontWeight: 600, textDecoration: 'none' }}>
                Se connecter →
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}