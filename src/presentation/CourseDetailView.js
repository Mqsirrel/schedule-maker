export class CourseDetailView {
  constructor({ modal, body, escapeHtml }) {
    this.modal = modal;
    this.body = body;
    this.escapeHtml = escapeHtml;
  }

  show(section) {
    if (!section || !this.modal) return;
    const e = this.escapeHtml;
    this.body.innerHTML = `<div style="display:flex;flex-direction:column;gap:.85rem"><div><h4 style="font-size:1.15rem;color:var(--color-primary)">${e(section.courseName)}</h4><p style="font-size:.9rem;margin-top:.2rem">${e(section.courseKey)} - شعبة ${e(section.section)}</p></div><div style="background:var(--color-bg-base);padding:1rem;border-radius:var(--radius-md);border:1px solid var(--color-border);display:grid;grid-template-columns:1fr 1fr;gap:.75rem;font-size:.9rem"><div><strong>أستاذ المادة:</strong> ${e(section.instructor)}</div><div><strong>الفرع:</strong> ${e(section.branch || 'المقر الرئيسي')}</div><div><strong>المقاعد المتاحة:</strong> ${section.availableSeats}</div><div><strong>المسجلون:</strong> ${section.enrolledSeats}</div></div></div>`;
    this.modal.showModal();
  }

  close() { this.modal?.close(); }
}
