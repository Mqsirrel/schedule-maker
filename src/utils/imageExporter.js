// Dedicated schedule image exporter for clean, device-independent sharing
import { ScheduleImageRenderer } from './scheduleImageRenderer.js';

export class ImageExporter {
  /**
   * Export the current schedule as a purpose-built PNG.
   * The element argument is retained for backwards compatibility with the UI.
   */
  static async exportToPng(_elementToCapture, filename = 'ScheduleMaker_Timetable.png') {
    const app = window.app;
    const schedule = app?.filteredSchedules?.[app.currentScheduleIndex];
    if (!schedule?.sections?.length) return false;

    try {
      const compact = window.matchMedia?.('(max-width: 600px)').matches ?? window.innerWidth <= 600;
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
      const canvas = ScheduleImageRenderer.render(schedule, {
        compact,
        theme,
        lang,
        scale: 2
      });

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(result => result ? resolve(result) : reject(new Error('Could not create PNG')), 'image/png');
      });

      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: lang === 'ar' ? 'الجدول الدراسي' : 'My Schedule',
            files: [file]
          });
          return true;
        } catch (error) {
          if (error?.name === 'AbortError') return false;
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return true;
    } catch (err) {
      console.error('Failed to export schedule image:', err);
      return false;
    }
  }
}
