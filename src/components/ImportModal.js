// Import Modal Component: File Drop, Raw Paste, CRN Paste & Tutorial Links
import { TimetableParser } from '../engine/parser.js';
import { parseCrnList } from '../utils/crnImporter.js';
import { t } from '../i18n/translations.js';

export class ImportModal {
  constructor(options = {}) {
    this.onTimetableLoaded = options.onTimetableLoaded || (() => {});
    this.onCrnsImported = options.onCrnsImported || (() => ({}));
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

    this._createCrnTab();
    this._bindEvents();
  }

  _createCrnTab() {
    this.tabCrn = document.createElement('button');
    this.tabCrn.type = 'button';
    this.tabCrn.className = this.tabPaste?.className || 'modal-tab';
    this.tabCrn.textContent = 'استيراد CRNs';
    this.tabCrn.setAttribute('aria-label', 'Import CRNs');
    this.tabPaste?.parentElement?.appendChild(this.tabCrn);

    this.contentCrn = document.createElement('div');
    this.contentCrn.id = 'contentImportCrns';
    this.contentCrn.style.display = 'none';
    this.contentCrn.innerHTML = `
      <div class="input-field">
        <label for="txtCrnImport">الصق المواد مع أرقام الشعب</label>
        <textarea id="txtCrnImport" class="input-text" rows="8" dir="auto"
          placeholder="CS-181 (شعبة 1A) - مقدمة في البرمجة\nMATH-101 (شعبة 12) - تفاضل وتكامل 1\nPHYS-101 (شعبة 5C) - فيزياء عامة"></textarea>
      </div>
      <div id="crnImportPreview" class="course-meta-box" hidden></div>
      <button type="button" id="btnProcessCrnImport" class="btn btn-primary btn-block">استيراد المواد</button>
    `;
    this.contentPaste?.parentElement?.appendChild(this.contentCrn);

    this.txtCrnImport = this.contentCrn.querySelector('#txtCrnImport');
    this.crnImportPreview = this.contentCrn.querySelector('#crnImportPreview');
    this.btnProcessCrnImport = this.contentCrn.querySelector('#btnProcessCrnImport');
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
    this.tabCrn.addEventListener('click', () => this._switchTab('crn'));

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

    this.btnProcessCrnImport.addEventListener('click', () => this._parseAndImportCrns());
    this.txtCrnImport.addEventListener('input', () => this._previewCrns());

    this.btnOpenGuide.addEventListener('click', () => {
      this.close();
      this.onOpenHelp();
    });
  }

  open() { this.modal.showModal(); }
  close() { this._animateClose(); }

  _animateClose() {
    const m = this.modal;
    if (!m || !m.open || m.dataset.closing) return;
    m.dataset.closing = 'true';
    m.classList.add('is-closing');
    setTimeout(() => {
      delete m.dataset.closing;
      m.classList.remove('is-closing');
      if (m.open) m.close();
    }, 150);
  }

  _switchTab(tabName) {
    const isUpload = tabName === 'upload';
    const isPaste = tabName === 'paste';
    const isCrn = tabName === 'crn';
    this.tabUpload.classList.toggle('active', isUpload);
    this.tabPaste.classList.toggle('active', isPaste);
    this.tabCrn.classList.toggle('active', isCrn);
    this.contentUpload.style.display = isUpload ? 'block' : 'none';
    this.contentPaste.style.display = isPaste ? 'block' : 'none';
    this.contentCrn.style.display = isCrn ? 'block' : 'none';
    if (isPaste) this.txtPaste.focus();
    if (isCrn) this.txtCrnImport.focus();
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

  _previewCrns() {
    const entries = parseCrnList(this.txtCrnImport.value);
    if (!entries.length) {
      this.crnImportPreview.hidden = true;
      return;
    }
    this.crnImportPreview.hidden = false;
    this.crnImportPreview.textContent = `${entries.length} مادة مكتشفة: ${entries.map(e => `${e.courseCode}-${e.courseNumber} → ${e.crn}`).join('، ')}`;
  }

  _parseAndImportCrns() {
    const entries = parseCrnList(this.txtCrnImport.value);
    if (!entries.length) {
      this.notification?.showError('لم يتم العثور على مواد بصيغة صحيحة.');
      return;
    }

    const result = this.onCrnsImported(entries) || {};
    const imported = Number(result.imported || 0);
    const unmatched = Array.isArray(result.unmatched) ? result.unmatched : [];
    const duplicate = Array.isArray(result.duplicate) ? result.duplicate : [];
    const timetableSections = Number(result.timetableSections || 0);

    if (imported > 0 && unmatched.length === 0 && duplicate.length === 0) {
      this.notification?.showSuccess(`تمت مطابقة واستيراد ${imported} مادة بنجاح.`);
    } else if (imported > 0) {
      const details = unmatched.map(e => `${e.courseCode}-${e.courseNumber} (${e.crn})`).join('، ');
      this.notification?.showInfo(`تم استيراد ${imported} مادة، و${unmatched.length} لم تطابق${details ? `: ${details}` : ''}${duplicate.length ? `، و${duplicate.length} مضافة مسبقًا` : ''}.`);
    } else if (unmatched.length > 0) {
      const details = unmatched.map(e => `${e.courseCode}-${e.courseNumber} (${e.crn})`).join('، ');
      const reason = timetableSections === 0
        ? 'لا توجد بيانات جدول دراسي محملة للمطابقة.'
        : 'لم تطابق أي شعبة في بيانات الجدول الحالية.';
      this.notification?.showError(`تم استخراج ${entries.length} مادة، لكن لم تتم مطابقة أي مادة. ${reason} ${details}`);
    } else if (duplicate.length > 0) {
      this.notification?.showInfo(`تم العثور على ${duplicate.length} مادة، لكنها مضافة مسبقًا.`);
    }

    this.txtCrnImport.value = '';
    this.crnImportPreview.hidden = true;
    if (imported > 0) this.close();
  }
}
