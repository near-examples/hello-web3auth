import { useEffect, useState } from 'react';
import NearLogo from '@/assets/near-logo.svg';
import { Link } from 'react-router-dom'; // Use react-router-dom for TSX
import styles from '@/styles/app.module.css';
import { useNEARxWeb3Auth } from '../context/useNear';
import { NEAR } from '@near-js/tokens';

export const Navigation = () => {
  // Define action type
  const [action, setAction] = useState<(() => void) | null>(null);
  const [label, setLabel] = useState<string>('Loading...');
  const [balance, setBalance] = useState<string | null>('0');

  const { walletId, nearAccount, web3AuthUser, login, logout, loading } =
    useNEARxWeb3Auth();

  // Update action & label based on login state
  useEffect(() => {
    if (loading) {
      setLabel('Loading...');
      return;
    }

    if (walletId) {
      const userId = web3AuthUser?.email || walletId;
      setAction(() => logout);
      setLabel(`Logout ${userId}`);
    } else {
      setAction(() => login);
      setLabel('Login');
      setBalance(null);
    }
  }, [web3AuthUser, loading, login, logout, walletId]);

  // Fetch NEAR balance
  useEffect(() => {
    if (walletId && nearAccount) {
      nearAccount
        .getBalance()
        .then((b) => setBalance(Number(NEAR.toDecimal(b)).toFixed(2)))
        .catch(() => setBalance('0')); // non-existing account
    }
  }, [walletId, nearAccount]);

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

          <button className="btn btn-secondary" onClick={action ?? undefined}>
            {label}
          </button>
        </div>
      </div>
    </nav>
  );
};
