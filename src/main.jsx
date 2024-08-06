import React from 'react'
import ReactDOM from 'react-dom/client'
import Canvas from './Canvas.jsx';
import Overlay from './Overlay.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Canvas />
    <Overlay />
  </>
)