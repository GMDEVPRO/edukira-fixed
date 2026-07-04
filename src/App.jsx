import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import { ErrorBoundary } from './components/error/ErrorBoundary'
import PageLoader from './components/layout/PageLoader'

const LandingPage         = lazy(() => import('./pages/landing/LandingPage'))
const RegisterPage        = lazy(() => import('./pages/RegisterPage'))
const StudentRegisterPage = lazy(() => import('./pages/StudentRegisterPage'))
const Login               = lazy(() => import('./pages/auth/Login'))
const Dashboard           = lazy(() => import('./pages/dashboard/Dashboard'))
const StudentPortal       = lazy(() => import('./pages/student/StudentPortal'))
const NotFound            = lazy(() => import('./pages/NotFound'))

function PrivateRoute({ children, roles }) {
  const { token, user } = useAuthStore()
  if (!token) {
    sessionStorage.setItem('edukira_redirect', window.location.pathname)
    return <Navigate to="/login" replace />
  }
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <ErrorBoundary section="Application">
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={
              <ErrorBoundary section="Landing Page"><LandingPage /></ErrorBoundary>
            }/>
            <Route path="/register" element={
              <ErrorBoundary section="Inscription École"><RegisterPage /></ErrorBoundary>
            }/>
            {/* /signup → backward compat redirect */}
            <Route path="/signup" element={<Navigate to="/register" replace />} />
            <Route path="/student" element={
              <ErrorBoundary section="Inscription Élève"><StudentRegisterPage /></ErrorBoundary>
            }/>
            <Route path="/login" element={
              <ErrorBoundary section="Connexion"><Login /></ErrorBoundary>
            }/>
            <Route path="/dashboard" element={
              <PrivateRoute roles={['SCHOOL_ADMIN','TEACHER','ADMIN']}>
                <ErrorBoundary section="Dashboard"><Dashboard /></ErrorBoundary>
              </PrivateRoute>
            }/>
            <Route path="/student/portal" element={
              <PrivateRoute roles={['STUDENT']}>
                <ErrorBoundary section="Portail Élève"><StudentPortal /></ErrorBoundary>
              </PrivateRoute>
            }/>
            <Route path="*" element={
              <ErrorBoundary section="404"><NotFound /></ErrorBoundary>
            }/>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
