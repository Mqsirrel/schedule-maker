// Toast Notification System with Optional Chime Audio

export class NotificationManager {
  constructor() {
    this.container = document.getElementById('toastContainer');
    this.audio = document.getElementById('audioChime');
  }

  showSuccess(message, duration = 4000) {
    this._createToast(message, 'success', duration);
  }

  showError(message, duration = 5000) {
    this._createToast(message, 'error', duration);
  }

  showInfo(message, duration = 4000) {
    this._createToast(message, 'info', duration);
  }

  playChime() {
    try {
      // Synthesize a gentle pleasant chime using Web Audio API (Zero external audio file dependency!)
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (e) {
      // Audio autoplay may be restricted until user gesture
    }
  }

  _createToast(message, type = 'info', duration = 4000) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--color-success)"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--color-danger)"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--color-primary)"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${this._escapeHtml(message)}</span>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this._dismissToast(toast);
    });

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        this._dismissToast(toast);
      }, duration);
    }
  }

  _dismissToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px) scale(0.95)';
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
