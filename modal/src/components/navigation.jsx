import { useEffect, useState } from 'react'

import NearLogo from '@/assets/near-logo.svg'
import { Link } from 'react-router'
import styles from '@/styles/app.module.css'

import { useNEARxWeb3Auth } from '../context/useNear'
import { useWeb3Auth } from '@web3auth/modal-react-hooks'
import { NEAR } from '@near-js/tokens'

export const Navigation = () => {
  const [action, setAction] = useState(() => {})
  const [label, setLabel] = useState('Loading...')
  const [balance, setBalance] = useState(0)
  
  // Web3Auth Modal for easy login UI
  const { connect, logout, isConnected, userInfo } = useWeb3Auth()
  
  // MPC Core Kit for NEAR transaction signing
  const { walletId, nearAccount, loading } = useNEARxWeb3Auth()

  useEffect(() => {
    if (loading) {
      setLabel('Loading...')
      return
    }

    if (isConnected) {
      const userId = userInfo?.email || userInfo?.name || 'User'
      setAction(() => logout)
      setLabel(`Logout ${userId}`)
    } else {
      setAction(() => connect)
      setLabel('Login')
      setBalance(null)
    }
  }, [isConnected, walletId, loading, userInfo, logout, connect])

  useEffect(() => {
    if (walletId && nearAccount) {
      nearAccount
        .getBalance()
        .then((b) => setBalance(Number(NEAR.toDecimal(b)).toFixed(2)))
        .catch(() => setBalance(0)) // non existing account
    }
  }, [walletId, nearAccount])

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
            {isConnected ? (
              <span className="badge text-dark small">
                {' '}
                <br />
                {walletId}: {balance} Ⓝ
              </span>
            ) : null}

            <button className="btn btn-secondary" onClick={action}>
              {label}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
