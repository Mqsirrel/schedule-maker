// Import Modal Component: File Drop, Raw Paste & Tutorial Links
import { TimetableParser } from '../engine/parser.js';
import { t } from '../i18n/translations.js';

export class ImportModal {
  constructor(options = {}) {
    this.onTimetableLoaded = options.onTimetableLoaded || (() => {});
    this.onOpenHelp = options.onOpenHelp || (() => {});
    this.notification = options.notification;

    this.modal = document.getElementById('importModal');
    this.btnOpen = document.getElementById('btnOpenImport');
    this.btnClose = document.getElementById('btnCloseImport');

    this.tabUpload = document.getElementById('tabUploadFile');
    this.tabPaste = document.getElementById('tabPasteText');
    this.contentUpload = document.getElementById('contentUploadFile');
    this.contentPaste = document.getElementById('contentPasteText');

    this.dropZone = document.getElementById('fileDropZone');
    this.fileInput = document.getElementById('inputFileUpload');
    this.txtPaste = document.getElementById('txtPasteArea');
    this.btnProcessPaste = document.getElementById('btnProcessPaste');
    this.btnOpenGuide = document.getElementById('btnOpenFullGuide');

    this._bindEvents();
  }

  _bindEvents() {
    this.btnOpen.addEventListener('click', () => this.open());
    this.btnClose.addEventListener('click', () => this.close());

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      const rect = this.modal.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
        && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        this.close();
      }
    });

    // Tab Switching
    this.tabUpload.addEventListener('click', () => this._switchTab('upload'));
    this.tabPaste.addEventListener('click', () => this._switchTab('paste'));

    // File Drag & Drop
    this.dropZone.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => this._handleFileSelect(e));

    ['dragenter', 'dragover'].forEach(eventName => {
      this.dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.remove('dragover');
      });
    });

    this.dropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this._readFile(files[0]);
      }
    });

    // Paste Process
    this.btnProcessPaste.addEventListener('click', () => {
      const content = this.txtPaste.value.trim();
      if (!content) return;
      this._parseAndLoad(content);
    });

    // Open Tutorial Guide
    this.btnOpenGuide.addEventListener('click', () => {
      this.close();
      this.onOpenHelp();
    });
  }

  open() {
    this.modal.showModal();
  }

  close() {
    this.modal.close();
  }

  _switchTab(tabName) {
    if (tabName === 'upload') {
      this.tabUpload.classList.add('active');
      this.tabPaste.classList.remove('active');
      this.contentUpload.style.display = 'block';
      this.contentPaste.style.display = 'none';
    } else {
      this.tabPaste.classList.add('active');
      this.tabUpload.classList.remove('active');
      this.contentPaste.style.display = 'block';
      this.contentUpload.style.display = 'none';
      this.txtPaste.focus();
    }
  }

  _handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
      this._readFile(files[0]);
    }
  }

  _readFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      this._parseAndLoad(content);
    };
    reader.onerror = () => {
      this.notification?.showError(t('toast_invalid_file'));
    };
    reader.readAsText(file);
  }

  _parseAndLoad(content) {
    const result = TimetableParser.parseHtml(content);
    if (result.success && result.sections.length > 0) {
      this.notification?.showSuccess(t('toast_timetable_loaded', { count: result.sections.length }));
      this.onTimetableLoaded(result.sections);
      this.close();
    } else {
      this.notification?.showError(t('toast_invalid_file'));
    }
  }
}
