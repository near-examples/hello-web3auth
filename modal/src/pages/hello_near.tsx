import { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { Cards } from '@/components/cards';
import styles from '@/styles/app.module.css';

import { HelloNearContract } from '@/config';
import { useNEARxWeb3Auth } from '../context/useNear';

// Contract that the app will interact with
const CONTRACT = HelloNearContract;

export default function HelloNear() {
  const [greeting, setGreeting] = useState<string>('loading...');
  const [newGreeting, setNewGreeting] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const { provider, nearAccount, walletId } = useNEARxWeb3Auth();

  // Fetch greeting from contract
const fetchGreeting = useCallback(async () => {
  if (!provider) return;

  try {
    const result = await provider.callFunction(CONTRACT, 'get_greeting', {});
    setGreeting(String(result ?? 'No greeting')); // force string
  } catch (err) {
    console.error('Error fetching greeting:', err);
    setGreeting('Error');
  }
}, [provider]);

  // Save greeting to contract
  const saveGreeting = async () => {
    if (!nearAccount) {
      alert('You must be logged in to save a greeting');
      return;
    }

    try {
      await nearAccount.callFunction({
        contractId: CONTRACT,
        methodName: 'set_greeting',
        args: { greeting: newGreeting },
      });

      setShowSpinner(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setGreeting(newGreeting);
    } catch (e: any) {
      alert(
        `Error, did you deposit any NEAR Ⓝ? You can get some at https://dev.near.org/faucet`
      );
      console.error('Error saving greeting:', e?.message || e);
      fetchGreeting();
    } finally {
      setShowSpinner(false);
    }
  };

  // Update login status
  useEffect(() => {
    setLoggedIn(!!walletId);
  }, [walletId]);

  // Fetch greeting on mount or when provider changes
  useEffect(() => {
    fetchGreeting();
  }, [fetchGreeting]);

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewGreeting(e.target.value);
  };

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
            onChange={handleInputChange}
            value={newGreeting}
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

        {!loggedIn && (
          <div className="w-100 text-end align-text-center">
            <p className="m-0"> Please login to change the greeting </p>
          </div>
        )}
      </div>

      <Cards />
    </main>
  );
}
