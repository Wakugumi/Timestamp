import { useState } from 'react'
import ImageEditor from './pages/ImageEditor'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="container">
        <div className="row">
          <ImageEditor></ImageEditor>
        </div>
      </div>
    </>
  )
}

export default App
