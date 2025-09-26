import { useEffect, useState } from 'react'
import NearLogo from '@/assets/near-logo.svg'
import { Link } from 'react-router-dom'
import styles from '@/styles/app.module.css'

import { useNEARxWeb3Auth } from '../context/useNear'
import { NEAR } from '@near-js/tokens'

export const Navigation = (): JSX.Element => {
  const [label, setLabel] = useState<string>('Loading...')
  const [balance, setBalance] = useState<string | null>(null)

  const { walletId, nearAccount, web3AuthUser, login, logout, loading } =
    useNEARxWeb3Auth()

  useEffect(() => {
    if (loading) {
      setLabel('Loading...')
      return
    }

    if (walletId) {
      const userId = web3AuthUser?.email || walletId
      setLabel(`Logout ${userId}`)
    } else {
      setLabel('Login')
      setBalance(null)
    }
  }, [web3AuthUser, loading, walletId])

  useEffect(() => {
    if (walletId && nearAccount) {
      nearAccount
        .getBalance()
        .then((b: bigint) => setBalance(Number(NEAR.toDecimal(b)).toFixed(2)))
        .catch(() => setBalance('0')) // non-existing account
    }
  }, [walletId, nearAccount])

  const handleClick = async () => {
    console.log("handleClick fired, walletId:", walletId)

    try {
      if (walletId) {
        console.log("Logging out...")
        await logout()
      } else {
        console.log("Logging in... opening modal")
        await login()
      }
    } catch (err) {
      console.error("Auth error:", err)
    }
  }

  return (
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
          {walletId && balance !== null && (
            <span className="badge text-dark small">
              <br />
              {walletId}: {balance} Ⓝ
            </span>
          )}
          <button
            className="btn btn-secondary"
            onClick={handleClick}
            disabled={loading}
          >
            {label}
          </button>
        </div>
      </div>
    </nav>
  )
}
