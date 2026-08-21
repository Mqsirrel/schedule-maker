export class ScheduleDiagnosticsView {
  constructor({ element, translate, escapeHtml }) {
    this.element = element;
    this.t = translate;
    this.escapeHtml = escapeHtml;
  }

  render(bottlenecks = []) {
    if (!this.element) return;
    if (!bottlenecks.length) {
      this.element.style.display = 'none';
      return;
    }

    const items = bottlenecks.map(b => `<li>${this.t('conflict_between_courses', {
      c1: `<strong>${this.escapeHtml(b.courseA)}</strong>`,
      c2: `<strong>${this.escapeHtml(b.courseB)}</strong>`
    })}</li>`).join('');

    this.element.innerHTML = `<div class="diagnostic-title"><strong>${this.t('conflict_diagnostic_title')}</strong></div><ul class="diagnostic-list">${items}</ul><p class="diagnostic-tip">💡 نصيحة: جرّب إزالة إحدى المادتين المتعارضتين أو تفعيل خيار الشعب الممتلئة لإيجاد جدول متوافق.</p>`;
    this.element.style.display = 'block';
  }
}
