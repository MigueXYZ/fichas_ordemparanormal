import React, { useState, useEffect, useCallback } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

/**
 * UpdateModal — checks for updates via GitHub Releases and shows
 * download progress + restart prompt when an update is available.
 */
export default function UpdateModal() {
  const [status, setStatus] = useState('idle');       // idle | checking | available | downloading | ready | error | dismissed
  const [updateInfo, setUpdateInfo] = useState(null);  // { version, body }
  const [progress, setProgress] = useState(0);         // 0–100
  const [error, setError] = useState(null);

  const checkForUpdate = useCallback(async () => {
    try {
      setStatus('checking');
      setError(null);

      const update = await check();

      if (update) {
        setUpdateInfo({ version: update.version, body: update.body });
        setStatus('available');
      } else {
        setStatus('idle');
      }
    } catch (err) {
      console.error('[Updater] check failed:', err);
      setError(String(err));
      setStatus('error');
    }
  }, []);

  // Check once on mount (only in production / Tauri context)
  useEffect(() => {
    if (window.__TAURI_INTERNALS__) {
      checkForUpdate();
    }
  }, [checkForUpdate]);

  const handleDownloadAndInstall = useCallback(async () => {
    try {
      setStatus('downloading');
      setProgress(0);

      const update = await check();
      if (!update) return;

      let totalLength = 0;
      let downloaded = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            totalLength = event.data.contentLength ?? 0;
            break;
          case 'Progress':
            downloaded += event.data.chunkLength;
            if (totalLength > 0) {
              setProgress(Math.round((downloaded / totalLength) * 100));
            }
            break;
          case 'Finished':
            setProgress(100);
            break;
        }
      });

      setStatus('ready');
    } catch (err) {
      console.error('[Updater] download failed:', err);
      setError(String(err));
      setStatus('error');
    }
  }, []);

  const handleRelaunch = useCallback(async () => {
    await relaunch();
  }, []);

  const dismiss = useCallback(() => {
    setStatus('dismissed');
  }, []);

  // Don't render anything if idle, dismissed, or not in Tauri
  if (status === 'idle' || status === 'dismissed' || status === 'checking') {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={dismiss} style={styles.closeBtn} title="Fechar">✕</button>

        {status === 'available' && (
          <>
            <h2 style={styles.title}>🔄 Atualização disponível!</h2>
            <p style={styles.version}>Versão {updateInfo?.version}</p>
            {updateInfo?.body && (
              <div style={styles.notes}>
                <strong>Novidades:</strong>
                <p>{updateInfo.body}</p>
              </div>
            )}
            <div style={styles.actions}>
              <button onClick={handleDownloadAndInstall} style={styles.primaryBtn}>
                Baixar e instalar
              </button>
              <button onClick={dismiss} style={styles.secondaryBtn}>
                Mais tarde
              </button>
            </div>
          </>
        )}

        {status === 'downloading' && (
          <>
            <h2 style={styles.title}>⬇️ Baixando atualização…</h2>
            <div style={styles.progressContainer}>
              <div style={{ ...styles.progressBar, width: `${progress}%` }} />
            </div>
            <p style={styles.progressText}>{progress}%</p>
          </>
        )}

        {status === 'ready' && (
          <>
            <h2 style={styles.title}>✅ Atualização pronta!</h2>
            <p style={styles.version}>Reinicie o aplicativo para aplicar.</p>
            <div style={styles.actions}>
              <button onClick={handleRelaunch} style={styles.primaryBtn}>
                Reiniciar agora
              </button>
              <button onClick={dismiss} style={styles.secondaryBtn}>
                Mais tarde
              </button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 style={styles.title}>❌ Erro na atualização</h2>
            <p style={styles.errorText}>{error}</p>
            <div style={styles.actions}>
              <button onClick={checkForUpdate} style={styles.primaryBtn}>
                Tentar novamente
              </button>
              <button onClick={dismiss} style={styles.secondaryBtn}>
                Fechar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 99999,
  },
  modal: {
    position: 'relative',
    backgroundColor: '#1a1a2e',
    border: '1px solid #e94560',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '420px',
    width: '90%',
    color: '#eee',
    fontFamily: 'inherit',
    boxShadow: '0 8px 32px rgba(233, 69, 96, 0.3)',
  },
  closeBtn: {
    position: 'absolute',
    top: '8px',
    right: '12px',
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  title: {
    margin: '0 0 0.75rem',
    fontSize: '1.3rem',
  },
  version: {
    color: '#aaa',
    marginBottom: '0.5rem',
  },
  notes: {
    backgroundColor: '#16213e',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    maxHeight: '120px',
    overflowY: 'auto',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  primaryBtn: {
    flex: 1,
    padding: '0.6rem 1rem',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.95rem',
  },
  secondaryBtn: {
    flex: 1,
    padding: '0.6rem 1rem',
    backgroundColor: 'transparent',
    color: '#aaa',
    border: '1px solid #555',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  progressContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: '#333',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '1rem',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#e94560',
    transition: 'width 0.3s ease',
    borderRadius: '4px',
  },
  progressText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: '0.5rem',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: '0.9rem',
    wordBreak: 'break-word',
  },
};
