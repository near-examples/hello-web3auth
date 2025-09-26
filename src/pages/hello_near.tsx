import { useEffect, useState, useCallback } from 'react'
import { Cards } from '@/components/cards'
import styles from '@/styles/app.module.css'
import { HelloNearContract } from '@/config'
import { useNEARxWeb3Auth } from '../context/useNear'
import { JsonRpcProvider } from '@near-js/providers'
import { Account } from '@near-js/accounts'

// Contract that the app will interact with
const CONTRACT = HelloNearContract

export default function HelloNear(): JSX.Element {
  const [greeting, setGreeting] = useState<string>('loading...')
  const [newGreeting, setNewGreeting] = useState<string>('loading...')
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [showSpinner, setShowSpinner] = useState<boolean>(false)

  const { provider, nearAccount, walletId } = useNEARxWeb3Auth() as {
    provider: JsonRpcProvider
    nearAccount: Account | null
    walletId: string | null
  }

  const fetchGreeting = useCallback(async () => {
    if (!provider) return
    try {
      const greeting = await provider.callFunction(CONTRACT, 'get_greeting', {})
      setGreeting(greeting as string)
    } catch (e) {
      console.error('Error fetching greeting:', e)
      setGreeting('Error fetching greeting')
    }
  }, [provider])

  const saveGreeting = async () => {
    if (!nearAccount) {
      alert('No NEAR account connected')
      return
    }

    try {
      await nearAccount.callFunction({
        contractId: CONTRACT,
        methodName: 'set_greeting',
        args: { greeting: newGreeting },
      })
      setShowSpinner(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setGreeting(newGreeting)
      setShowSpinner(false)
    } catch (e: any) {
      alert(
        `Error, did you deposit any NEAR Ⓝ? You can get some at https://dev.near.org/faucet`
      )
      console.error('Error saving greeting:', e?.message ?? e)
      fetchGreeting()
    }
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
              <span hidden={showSpinner}>Save</span>
              <i
                className="spinner-border spinner-border-sm"
                hidden={!showSpinner}
              ></i>
            </button>
          </div>
        </div>

        <div className="w-100 text-end align-text-center" hidden={loggedIn}>
          <p className="m-0">Please login to change the greeting</p>
        </div>
      </div>

      <Cards />
    </main>
  )
}
