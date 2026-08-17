// Help & Step-by-Step Tutorial Modal Component

export class HelpModal {
  constructor() {
    this.modal = document.getElementById('helpModal');
    this.btnOpen = document.getElementById('btnOpenHelp');
    this.btnClose = document.getElementById('btnCloseHelp');

    this._bindEvents();
  }

  _bindEvents() {
    if (this.btnOpen) {
      this.btnOpen.addEventListener('click', () => this.open());
    }
    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        const rect = this.modal.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
          && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) {
          this.close();
        }
      });
    }
  }

  open() {
    if (this.modal) this.modal.showModal();
  }

  close() {
    if (this.modal) this.modal.close();
  }
}
