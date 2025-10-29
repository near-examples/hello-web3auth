import { Navigation } from './components/navigation'
import Home from './pages/home'

import HelloNear from './pages/hello_near'
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router'
import { Web3AuthProvider } from "@web3auth/modal-react-hooks";

import { NEARxWeb3Auth } from './context/provider'
import { web3AuthContextConfig } from './config';

function App() {
  // Use HashRouter when deployed under a subpath (GitHub Pages)
  const useHashRouter = import.meta.env.BASE_URL !== '/'
  const Router = useHashRouter ? HashRouter : BrowserRouter

  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
      <NEARxWeb3Auth>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hello-near" element={<HelloNear />} />
          </Routes>
        </Router>
      </NEARxWeb3Auth>
    </Web3AuthProvider>
  )
}

export default App
