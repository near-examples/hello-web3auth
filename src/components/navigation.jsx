import { useEffect, useState, useCallback, useRef } from 'react'

import NearLogo from '@/assets/near-logo.svg'
import { Link } from 'react-router'
import styles from '@/styles/app.module.css'

import { useNEARxWeb3Auth } from '../context/useNear'
import { NEAR } from '@near-js/tokens'
import { useWeb3Auth } from '@web3auth/modal-react-hooks'

export const Navigation = () => {
  const [balance, setBalance] = useState(0)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false)
  const loginInProgressRef = useRef(false)

  // MPC Core Kit context for NEAR account management
  const { walletId, nearAccount, web3AuthUser, loginWithJWT, logout: mpcLogout } =
    useNEARxWeb3Auth()
  
  // Web3Auth Modal hooks for UI and authentication
  const { connect, logout: modalLogout, isConnected, userInfo, isInitialized, web3Auth, authenticateUser, status } = useWeb3Auth()

  // Update balance when wallet is connected
  useEffect(() => {
    if (walletId && nearAccount) {
      nearAccount
        .getBalance()
        .then((b) => setBalance(Number(NEAR.toDecimal(b)).toFixed(2)))
        .catch(() => setBalance(0)) // non existing account
    } else {
      setBalance(0)
    }
  }, [walletId, nearAccount])
  console.log({walletId, nearAccount, web3AuthUser, isLoggingIn, hasAttemptedLogin});
  // Get identity token from Web3Auth and login to MPC
  const getIdentityToken = useCallback(async () => {
    console.log({ web3Auth, isLoggingIn, hasAttemptedLogin, loginInProgressRef: loginInProgressRef.current });
    
    // Use ref to prevent race conditions
    if (!web3Auth || loginInProgressRef.current) {
      console.log('Web3Auth not initialized or login already in progress');
      return null
    }
    
    loginInProgressRef.current = true
    setIsLoggingIn(true)
    setHasAttemptedLogin(true)
    
    try {
      // Authenticate and get ID token from Web3Auth
      const idToken = await authenticateUser()
      const tokenString = idToken?.idToken || null
      
      if (!tokenString) {
        console.error('No ID token received')
        setHasAttemptedLogin(false) // Reset if no token
        loginInProgressRef.current = false
        return null
      }

      // Parse the JWT to get the verifierId
      const base64Url = tokenString.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const parsedToken = JSON.parse(jsonPayload)
      
      // Web3Auth tokens use 'verifierId' or 'userId' instead of 'sub'
      const verifierId = parsedToken.verifierId || parsedToken.userId || parsedToken.sub
      console.log({tokenString, verifierId, parsedToken});
      
      if (tokenString && verifierId) {
        console.log('Logging in with JWT:', { verifierId })
        await loginWithJWT(tokenString, verifierId)
      }
      
      return tokenString
    } catch (err) {
      console.error('Error getting identity token:', err)
      
      // If it's a duplicate token error, don't reset - user might be logged in
      if (!err.message?.includes('Duplicate token')) {
        setHasAttemptedLogin(false) // Only reset on non-duplicate errors
      }
      
      return null
    } finally {
      setIsLoggingIn(false)
      loginInProgressRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Auth, authenticateUser, loginWithJWT])
  
  // Automatically login to MPC when Web3Auth modal is connected
  useEffect(() => {
    console.log({status, walletId, web3AuthUser, isLoggingIn, hasAttemptedLogin})
    
    if (status === 'connected' && !walletId && !web3AuthUser && !isLoggingIn && !hasAttemptedLogin) {
      getIdentityToken()
    }
  }, [status, walletId, web3AuthUser, isLoggingIn, hasAttemptedLogin, getIdentityToken])

  // Reset hasAttemptedLogin when user logs out
  useEffect(() => {
    if (!isConnected) {
      setHasAttemptedLogin(false)
      loginInProgressRef.current = false
    }
  }, [isConnected])

  // Handle combined logout
  const handleLogout = async () => {
    loginInProgressRef.current = false
    if (walletId) {
      await mpcLogout()
    }
    if (isConnected) {
      await modalLogout()
    }
  }

  // Determine button state and labels
  const getButtonState = () => {
    if (!isInitialized) {
      return {
        action: null,
        label: 'Initializing...',
        disabled: true
      }
    }
    
    if (isLoggingIn) {
      return {
        action: null,
        label: 'Connecting to MPC...',
        disabled: true
      }
    }
    
    if (isConnected && walletId) {
      // Both Web3Auth modal and MPC are connected
      const userEmail = userInfo?.email || web3AuthUser?.email
      return {
        action: handleLogout,
        label: `Logout ${userEmail || 'User'}`,
        disabled: false
      }
    }
    
    if (isConnected && !walletId) {
      // Web3Auth modal connected but MPC login in progress
      return {
        action: null,
        label: 'Connecting to MPC...',
        disabled: true
      }
    }
    
    // Not connected - show login button
    return {
      action: connect,
      label: 'Login with Web3Auth',
      disabled: false
    }
  }

  const buttonState = getButtonState()
  
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link to="/">
            <img
              src={NearLogo}
              alt="NEAR"
              width="30"
              height="24"
              className={styles.logo}
            />
          </Link>
          <div className="navbar-nav pt-1">
            {walletId ? (
              <span className="badge text-dark small">
                {walletId}: {balance} Ⓝ
              </span>
            ) : null}
            <button
              className="btn btn-primary"
              onClick={buttonState.action}
              disabled={buttonState.disabled}
            >
              {buttonState.label}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
