import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import NearLogo from '@/assets/near-logo.svg';
import styles from '@/styles/app.module.css';

import { useNEARxWeb3Auth } from '../context/useNear';
import { useWeb3Auth } from '@web3auth/modal-react-hooks';
import { NEAR } from '@near-js/tokens';

export const Navigation = () => {
  const [action, setAction] = useState<() => void>(() => () => {});
  const [label, setLabel] = useState<string>('Loading...');
  const [balance, setBalance] = useState<string | number>('0');

  // Web3Auth Modal for login/logout
  const { connect, logout, isConnected, userInfo } = useWeb3Auth();

  const { walletId, nearAccount, loading } = useNEARxWeb3Auth();

  useEffect(() => {
    if (loading) {
      setLabel('Loading...');
      return;
    }

    if (isConnected) {
      const userId = userInfo?.email || userInfo?.name || 'User';
      setAction(() => logout);
      setLabel(`Logout ${userId}`);
    } else {
      setAction(() => connect);
      setLabel('Login');
      setBalance('0');
    }
  }, [isConnected, walletId, loading, userInfo, logout, connect]);

  // Fetch NEAR balance
  useEffect(() => {
    if (walletId && nearAccount) {
      nearAccount
        .getBalance()
        .then((b) => {
          const formatted = Number(NEAR.toDecimal(b)).toFixed(2);
          setBalance(formatted);
        })
        .catch(() => setBalance('0')); 
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
          {isConnected && (
            <span className="badge text-dark small">
              <br />
              {walletId}: {balance} Ⓝ
            </span>
          )}
          <button className="btn btn-secondary" onClick={action}>
            {label}
          </button>
        </div>
      </div>
    </nav>
  );
};
