import React, { useEffect, useState } from 'react';
import { VaultItem, VaultType } from '../types';

interface VaultViewProps {
  id: string;
}

const API_BASE = 'http://localhost:4000/api/vault';

const VaultView: React.FC<VaultViewProps> = ({ id }) => {
  const [item, setItem] = useState<VaultItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Fetch vault metadata
  useEffect(() => {
    const loadVault = async () => {
      try {
        const res = await fetch(`${API_BASE}/${id}`);
        const data = await res.json();

        if (res.status === 403) {
          // Password required
          setIsUnlocked(false);
          return;
        }

        if (!res.ok) {
          setError(data.error || 'Vault not found');
          return;
        }

        // No password required → unlocked immediately
        setItem(data);
        setIsUnlocked(true);

      } catch {
        setError('Failed to load vault');
      } finally {
        setLoading(false);
      }
    };

    loadVault();
  }, [id]);

  // Unlock password-protected vault
  const handleUnlock = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/${id}?password=${passwordInput}`
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Incorrect password');
        return;
      }

      setItem(data);
      setIsUnlocked(true);

    } catch {
      alert('Failed to unlock vault');
    }
  };


  // Download file via SERVER
  const handleDownload = () => {
    if (!item) return;
    window.location.href = `${API_BASE}/${item.id}/download`;
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p>Loading vault…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        {error}
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto py-20">
        <input
          type="password"
          placeholder="Enter password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <button
          onClick={handleUnlock}
          className="w-full mt-4 bg-indigo-600 text-white p-3 rounded"
        >
          Unlock
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-white p-8 rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          {item?.type === VaultType.FILE ? item.file_name : 'Secure Note'}
        </h2>

        {item?.type === VaultType.TEXT ? (
          <pre className="bg-gray-900 text-white p-4 rounded">
            {item.content}
          </pre>
        ) : (
          <button
            onClick={handleDownload}
            className="bg-indigo-600 text-white px-6 py-3 rounded"
          >
            Download File
          </button>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>Created: {new Date(item!.created_at).toLocaleString()}</p>
          <p>Expires: {new Date(item!.expires_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default VaultView;
