import { useEffect, useState } from 'react'

import NearLogo from '@/assets/near-logo.svg'
import { Link } from 'react-router'
import styles from '@/styles/app.module.css'

import { useNEARxWeb3Auth } from '../context/useNear'
import { NEAR } from '@near-js/tokens'

export const Navigation = () => {
  const [action, setAction] = useState(() => {})
  const [label, setLabel] = useState('Loading...')
  const [balance, setBalance] = useState(0)

  const { walletId, nearAccount, web3AuthUser, login, logout, loading } =
    useNEARxWeb3Auth()

  useEffect(() => {
    if (loading) return setLabel('Loading...')

    if (walletId) {
      const userId = web3AuthUser?.email || walletId
      setAction(() => logout)
      setLabel(`Logout ${userId}`)
    } else {
      setAction(() => login)
      setLabel('Login')
      setBalance(null)
    }
  }, [web3AuthUser, loading, login, logout, walletId])

  useEffect(() => {
    if (walletId) {
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
            {walletId ? (
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
