import React, { Suspense } from 'react'
import './App.css'
import Header from './components/Header'
import Vaults from './components/Vaults'
import Faucet from './components/Faucet'
import { Route, Routes } from 'react-router-dom'
import { ConnectProvider } from './state/ConnectContext'
import { ThemeProvider } from './state/ThemeContext'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ErrorBoundary from './components/Layout/ErrorBoundary'
import Spinner from './components/Layout/Spinner'
import NotFound from './components/Layout/NotFound'

const Toastify: React.FC = (): JSX.Element => (
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
)

export const getLibrary = (): ethers.providers.Web3Provider => {
  return new ethers.providers.Web3Provider(window.ethereum)
}

const App: React.FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ConnectProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <Suspense fallback={<Spinner />}>
              <Toastify />
              <Header />
              <Routes>
                <Route path="/" element={<Vaults />} />
                <Route path="/faucet" element={<Faucet />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </ThemeProvider>
      </ConnectProvider>
    </Web3ReactProvider>
  )
}

export default App
