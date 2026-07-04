/**
 * SHIM de compatibilité — redirige vers src/api/axios.js
 * Ne pas utiliser ce fichier pour de nouvelles fonctionnalités.
 * Utilisez: import api from '@/api/axios'
 */
export {
  createLead,
  registerSchool,
  loginAdmin,
  loginStudent,
  getCountries,
} from '../api/axios'
