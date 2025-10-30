import { Navigation } from './components/navigation'
import Home from './pages/home'

import HelloNear from './pages/hello_near'
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router'

import { NEARxWeb3Auth } from './context/provider'

function App() {
  // Use HashRouter when deployed under a subpath (GitHub Pages)
  const useHashRouter = import.meta.env.BASE_URL !== '/'
  const Router = useHashRouter ? HashRouter : BrowserRouter

  return (
    <NEARxWeb3Auth>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hello-near" element={<HelloNear />} />
        </Routes>
      </Router>
    </NEARxWeb3Auth>
  )
}

export default App
