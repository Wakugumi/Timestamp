import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import WelcomePage from './pages/WelcomePage'
import PhaseOnePage from './pages/PhaseOnePage'
import ProtectedRoute from './components/navigation/ProtectedRoute'
import { PhaseProvider } from './contexts/PhaseContext'
import PhaseThreePage from './pages/PhaseThreePage'
import SettingPage from './pages/SettingPage'


function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {

  }, [])

  return (
    <>
      <div className="min-h-dvh bg-surface-container">
      <PhaseProvider>

      <BrowserRouter>
        <Routes>
        <Route path='/' element={ <WelcomePage/> } />
        <Route path='/setting' element={ <SettingPage />} />
        <Route path='/phase1' element={ <ProtectedRoute phaseNumber={1}> <PhaseOnePage/> </ProtectedRoute> } />
        <Route path="/phase3" element={ <PhaseThreePage/> } />
        </Routes>
      </BrowserRouter>
      </PhaseProvider>
      </div>
    </>
  )
}

export default App
