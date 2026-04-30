import { Moon, Sun, X } from 'lucide-react';

export default function SettingsModal({ theme, onThemeChange, onLogout, onClose }) {
  return (
    <div className="modal-backdrop">
      <section className="settings-modal">
        <div className="modal-heading">
          <h2>Settings</h2>
          <button type="button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>

        <div className="theme-switch">
          <button
            type="button"
            className={theme === 'light' ? 'is-active' : ''}
            onClick={() => onThemeChange('light')}
          >
            <Sun size={18} />
            Light
          </button>
          <button
            type="button"
            className={theme === 'dark' ? 'is-active' : ''}
            onClick={() => onThemeChange('dark')}
          >
            <Moon size={18} />
            Dark
          </button>
        </div>

        <button type="button" className="logout-button" onClick={onLogout}>
          ログアウト
        </button>
      </section>
    </div>
  );
}
