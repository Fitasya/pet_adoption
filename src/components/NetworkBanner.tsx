import React from 'react';
import { useOnlineStatus } from './useOnlineStatus';

export const NetworkBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {isOnline ? (
        <p>🟢 Connected to network</p>
      ) : (
        <p>🔴 You are currently offline. Changes will sync when online.</p>
      )}
    </div>
  );
};