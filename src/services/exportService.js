import { IcsExporter } from '../utils/icsExporter.js';
import { ImageExporter } from '../utils/imageExporter.js';

export const exportService = {
  ics(schedule, options = {}) {
    return IcsExporter.exportSchedule(schedule, options);
  },
  image(element, filename = 'Taibah_Schedule.png') {
    return ImageExporter.exportElement(element, filename);
  }
};
