import { useEffect, useState } from 'react'

import { Cards } from '@/components/cards'
import styles from '@/styles/app.module.css'

import { HelloNearContract } from '@/config'
import { useNEARxWeb3Auth } from '../context/useNear'
import { useCallback } from 'react'

// Contract that the app will interact with
const CONTRACT = HelloNearContract

export default function HelloNear() {
  const [greeting, setGreeting] = useState('loading...')
  const [newGreeting, setNewGreeting] = useState('loading...')
  const [loggedIn, setLoggedIn] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  const { provider, nearAccount, walletId } = useNEARxWeb3Auth()

  const fetchGreeting = useCallback(async () => {
    const greeting = await provider.callFunction(CONTRACT, 'get_greeting', {})
    setGreeting(greeting)
  }, [provider])

  const saveGreeting = async () => {
    nearAccount
      .callFunction({
        contractId: CONTRACT,
        methodName: 'set_greeting',
        args: { greeting: newGreeting },
      })
      .catch((e) => {
        alert(
          `Error, did you deposit any NEAR Ⓝ? You can get some at https://dev.near.org/faucet`
        )
        console.log(`Error saving greeting: ${e.message}`)
        fetchGreeting()
      })

    setShowSpinner(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setGreeting(newGreeting)
    setShowSpinner(false)
  }

  useEffect(() => {
    setLoggedIn(!!walletId)
  }, [walletId])

  useEffect(() => {
    fetchGreeting()
  }, [fetchGreeting])

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Interacting with the contract: &nbsp;
          <code className={styles.code}>{CONTRACT}</code>
        </p>
      </div>

      <div className={styles.center}>
        <h1 className="w-100">
          The contract says: <code>{greeting}</code>
        </h1>
        <div className="input-group" hidden={!loggedIn}>
          <input
            type="text"
            className="form-control w-20"
            placeholder="Store a new greeting"
            onChange={(t) => setNewGreeting(t.target.value)}
          />
          <div className="input-group-append">
            <button className="btn btn-secondary" onClick={saveGreeting}>
              <span hidden={showSpinner}> Save </span>
              <i
                className="spinner-border spinner-border-sm"
                hidden={!showSpinner}
              ></i>
            </button>
          </div>
        </div>
        <div className="w-100 text-end align-text-center" hidden={loggedIn}>
          <p className="m-0"> Please login to change the greeting </p>
        </div>
      </div>
      <Cards />
    </main>
  )
}
