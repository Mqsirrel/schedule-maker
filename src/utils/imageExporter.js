// High-Resolution Image Exporter for WhatsApp & Gallery Sharing
import { toPng } from 'html-to-image';

export class ImageExporter {
  /**
   * Captures the calendar grid as a high-resolution PNG image and triggers download.
   * @param {HTMLElement} elementToCapture
   * @param {string} filename
   */
  static async exportToPng(elementToCapture, filename = 'ScheduleMaker_Timetable.png') {
    if (!elementToCapture) return false;

    try {
      // Calculate high DPI scale (2x for retina quality)
      const scale = 2;
      const dataUrl = await toPng(elementToCapture, {
        quality: 0.95,
        pixelRatio: scale,
        cacheBust: true,
        style: {
          transform: 'none',
          borderRadius: '16px'
        },
        filter: (node) => {
          // Filter out unwanted UI overlays if any
          return !node.classList?.contains('no-export');
        }
      });

      const downloadLink = document.createElement('a');
      downloadLink.download = filename;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      return true;
    } catch (err) {
      console.error('Failed to export PNG snapshot:', err);
      // Fallback via printable window
      window.print();
      return false;
    }
  }
}
