// Import Modal Component: File Drop, URL Fetch, Raw Paste & Tutorial Links
import { TimetableParser } from '../engine/parser.js';
import { fetchHtmlFromUrl } from '../utils/urlHtmlFetcher.js';
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

    this._addUrlImportTab();
    this._bindEvents();
  }

  _addUrlImportTab() {
    const tabs = this.modal.querySelector('.modal-tabs');
    if (!tabs) return;

    this.tabUrl = document.createElement('button');
    this.tabUrl.type = 'button';
    this.tabUrl.className = 'tab-btn';
    this.tabUrl.id = 'tabImportUrl';
    this.tabUrl.textContent = 'استيراد من رابط';
    tabs.appendChild(this.tabUrl);

    this.contentUrl = document.createElement('div');
    this.contentUrl.className = 'tab-content url-import-content';
    this.contentUrl.id = 'contentImportUrl';
    this.contentUrl.hidden = true;
    this.contentUrl.innerHTML = `
      <label for="inputImportUrl" class="form-label">رابط صفحة الجدول الزمني</label>
      <div class="url-import-row">
        <input id="inputImportUrl" class="input-text" type="url" inputmode="url"
          autocomplete="url" placeholder="https://example.com/timetable" dir="ltr">
        <button id="btnFetchImportUrl" class="btn btn-primary" type="button">جلب واستيراد</button>
      </div>
      <p class="url-import-hint">
        الصق رابط صفحة الجدول وسنحاول جلب HTML وتحليله تلقائياً. لا نرسل بيانات تسجيل الدخول أو الكوكيز.
      </p>
      <div id="urlImportStatus" class="url-import-status" role="status" aria-live="polite" hidden></div>
    `;
    this.modal.querySelector('.modal-body')?.appendChild(this.contentUrl);

    const style = document.createElement('style');
    style.textContent = `
      .url-import-content { padding-top: .25rem; }
      .url-import-row { display: grid; grid-template-columns: 1fr auto; gap: .65rem; align-items: stretch; }
      .url-import-row .input-text { min-width: 0; direction: ltr; text-align: left; }
      .url-import-row .btn { white-space: nowrap; }
      .url-import-hint { margin: .65rem 0 0; color: var(--color-text-secondary); font-size: .82rem; line-height: 1.55; }
      .url-import-status { margin-top: .75rem; padding: .7rem .8rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-base); color: var(--color-text-secondary); font-size: .82rem; line-height: 1.5; }
      .url-import-status.is-error { border-color: var(--color-danger); color: var(--color-danger); }
      @media (max-width: 600px) {
        .url-import-row { grid-template-columns: 1fr; }
        .url-import-row .btn { width: 100%; min-height: 44px; }
      }
    `;
    this.modal.appendChild(style);

    this.inputImportUrl = this.contentUrl.querySelector('#inputImportUrl');
    this.btnFetchImportUrl = this.contentUrl.querySelector('#btnFetchImportUrl');
    this.urlImportStatus = this.contentUrl.querySelector('#urlImportStatus');
  }

  _bindEvents() {
    this.btnOpen.addEventListener('click', () => this.open());
    this.btnClose.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', (e) => {
      const rect = this.modal.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
        && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) this.close();
    });

    this.tabUpload.addEventListener('click', () => this._switchTab('upload'));
    this.tabPaste.addEventListener('click', () => this._switchTab('paste'));
    this.tabUrl?.addEventListener('click', () => this._switchTab('url'));

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
      if (files.length > 0) this._readFile(files[0]);
    });

    this.btnProcessPaste.addEventListener('click', () => {
      const content = this.txtPaste.value.trim();
      if (content) this._parseAndLoad(content);
    });

    this.btnFetchImportUrl?.addEventListener('click', () => this._fetchUrl());
    this.inputImportUrl?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this._fetchUrl();
      }
    });

    this.btnOpenGuide.addEventListener('click', () => {
      this.close();
      this.onOpenHelp();
    });
  }

  open() { this.modal.showModal(); }
  close() { this.modal.close(); }

  _switchTab(tabName) {
    const isUrl = tabName === 'url';
    const isUpload = tabName === 'upload';

    this.tabUpload.classList.toggle('active', isUpload);
    this.tabPaste.classList.toggle('active', tabName === 'paste');
    this.tabUrl?.classList.toggle('active', isUrl);

    this.contentUpload.style.display = isUpload ? 'block' : 'none';
    this.contentPaste.style.display = tabName === 'paste' ? 'block' : 'none';
    if (this.contentUrl) this.contentUrl.hidden = !isUrl;

    if (isUrl) this.inputImportUrl?.focus();
    if (tabName === 'paste') this.txtPaste.focus();
  }

  _handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) this._readFile(files[0]);
  }

  _readFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => this._parseAndLoad(e.target.result);
    reader.onerror = () => this.notification?.showError(t('toast_invalid_file'));
    reader.readAsText(file);
  }

  async _fetchUrl() {
    const rawUrl = this.inputImportUrl?.value.trim();
    if (!rawUrl || this.btnFetchImportUrl?.disabled) return;

    this._setUrlLoading(true);
    try {
      const { html } = await fetchHtmlFromUrl(rawUrl);
      const result = TimetableParser.parseHtml(html);
      if (!result.success || result.sections.length === 0) throw new Error('NO_TIMETABLE_DATA');

      this.notification?.showSuccess(t('toast_timetable_loaded', { count: result.sections.length }));
      this.onTimetableLoaded(result.sections);
      this.close();
    } catch (error) {
      const message = error.message === 'CORS_OR_NETWORK'
        ? 'الرابط رفض القراءة من المتصفح (CORS)، أو تعذر الاتصال. إذا كانت الصفحة تتطلب تسجيل دخول، احفظ HTML أو الصقه هنا.'
        : error.message === 'TIMEOUT'
          ? 'انتهت مهلة جلب الصفحة. جرّب مرة ثانية أو استخدم ملف HTML.'
          : error.message === 'NO_TIMETABLE_DATA'
            ? 'تم جلب الصفحة، لكن لم نجد بيانات جدول يمكن قراءتها فيها.'
            : 'الرابط غير صالح أو غير مدعوم.';
      this._setUrlStatus(message, true);
    } finally {
      this._setUrlLoading(false);
    }
  }

  _setUrlLoading(loading) {
    if (!this.btnFetchImportUrl) return;
    this.btnFetchImportUrl.disabled = loading;
    this.btnFetchImportUrl.textContent = loading ? 'جاري الجلب…' : 'جلب واستيراد';
    if (loading) this._setUrlStatus('جاري جلب HTML وتحليله…', false);
  }

  _setUrlStatus(message, isError) {
    if (!this.urlImportStatus) return;
    this.urlImportStatus.hidden = false;
    this.urlImportStatus.textContent = message;
    this.urlImportStatus.classList.toggle('is-error', isError);
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
