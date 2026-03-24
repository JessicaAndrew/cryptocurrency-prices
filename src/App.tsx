import { Suspense, lazy } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './components/Header'
import { Loading } from './components/Loading'

const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })))
const CryptoDetails = lazy(() =>
  import('./pages/CryptoDetails').then((module) => ({ default: module.CryptoDetails }))
)

function App() {
  return (
    <Router>
      <div className="bg-crypto-darker text-white min-h-screen">
        <Header />
        <Suspense fallback={<Loading message="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crypto/:id" element={<CryptoDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
