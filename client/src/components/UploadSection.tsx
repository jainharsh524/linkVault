
import React, { useState, useRef } from 'react';
import { VaultType, UploadSettings } from '../types';
export const UploadSection: React.FC = () => {
  const [type, setType] = useState<VaultType>(VaultType.TEXT);
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<UploadSettings>({
    expiryMinutes: 10,
    isOneTime: false,
    password: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (type === VaultType.TEXT && !textContent.trim()) return;
    if (type === VaultType.FILE && !file) return;

    setIsUploading(true);

    try {
      const expiresAt = new Date(
        Date.now() + settings.expiryMinutes * 60000
      ).toISOString();

      const formData = new FormData();
      formData.append('type', type);
      formData.append('expires_at', expiresAt);
      formData.append('is_one_time', String(settings.isOneTime));
      if (settings.password) {
        formData.append('password', settings.password);
      }

      if (type === VaultType.TEXT) {
        formData.append('content', textContent);
      }

      if (type === VaultType.FILE && file) {
        formData.append('file', file);
      }

      const response = await fetch(
        'http://localhost:4000/api/vault/create',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setGeneratedLink(
        `${window.location.origin}/vault/${data.id}`
      );

    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };


  if (generatedLink) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Vault Link Ready!</h3>
          <p className="text-gray-500">This link will expire in {settings.expiryMinutes} minutes.</p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg mb-6">
          <input
            type="text"
            readOnly
            value={generatedLink}
            className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-mono text-gray-600"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(generatedLink);
              alert('Copied to clipboard!');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Copy
          </button>
        </div>

        <button
          onClick={() => {
            setGeneratedLink(null);
            setTextContent('');
            setFile(null);
          }}
          className="w-full py-3 text-indigo-600 font-medium hover:bg-indigo-50 rounded-xl transition-colors"
        >
          Upload Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Type Toggle */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setType(VaultType.TEXT)}
          className={`flex-1 py-4 text-sm font-semibold transition-colors ${type === VaultType.TEXT ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Plain Text
        </button>
        <button
          onClick={() => setType(VaultType.FILE)}
          className={`flex-1 py-4 text-sm font-semibold transition-colors ${type === VaultType.FILE ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Any File
        </button>
      </div>

      <div className="p-8">
        {type === VaultType.TEXT ? (
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Paste your secret text here..."
            className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none font-mono text-sm"
          />
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="text-center">
                <p className="font-semibold text-indigo-600">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <>
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-500">Click to browse or drag and drop</p>
              </>
            )}
          </div>
        )}

        {/* Settings Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Expiry Duration</label>
            <select
              value={settings.expiryMinutes}
              onChange={(e) => setSettings(s => ({ ...s, expiryMinutes: Number(e.target.value) }))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={10}>10 Minutes (Default)</option>
              <option value={60}>1 Hour</option>
              <option value={1440}>24 Hours</option>
              <option value={10080}>7 Days</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password Protection (Optional)</label>
            <input
              type="password"
              placeholder="Enter password..."
              value={settings.password}
              onChange={(e) => setSettings(s => ({ ...s, password: e.target.value }))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            id="oneTime"
            checked={settings.isOneTime}
            onChange={(e) => setSettings(s => ({ ...s, isOneTime: e.target.checked }))}
            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          <label htmlFor="oneTime" className="text-sm font-medium text-gray-700">
            One-time view (Delete immediately after first access)
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading || (type === VaultType.TEXT ? !textContent : !file)}
          className={`mt-8 w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isUploading || (type === VaultType.TEXT ? !textContent : !file) ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'}`}
        >
          {isUploading ? 'Creating Vault...' : 'Generate Secure Link'}
        </button>
      </div>
    </div>
  );
};

export default UploadSection; 
