// Solver Manager: dispatches tasks to Web Worker or direct DFS fallback
import { generateSchedulesDFS } from './solver.worker.js';

export class ScheduleSolver {
  /**
   * Solves for all conflict-free schedules given grouped course sections.
   * @param {Array<Array<Object>>} courseGroups
   * @param {Object} options
   * @returns {Promise<Array<Object>>}
   */
  static async solve(courseGroups, options = {}) {
    if (!courseGroups || courseGroups.length === 0) {
      return [];
    }

    // Try executing in Web Worker for non-blocking UI
    if (typeof Worker !== 'undefined') {
      try {
        return await this._solveInWorker(courseGroups, options);
      } catch (workerErr) {
        console.warn('Web Worker failed, falling back to main-thread solver:', workerErr);
      }
    }

    // Direct synchronous fallback
    return generateSchedulesDFS(courseGroups, options);
  }

  static _solveInWorker(courseGroups, options) {
    return new Promise((resolve, reject) => {
      // Create inline or module worker
      try {
        const worker = new Worker(new URL('./solver.worker.js', import.meta.url), { type: 'module' });

        const timeoutId = setTimeout(() => {
          worker.terminate();
          // Fallback to synchronous execution
          resolve(generateSchedulesDFS(courseGroups, options));
        }, 10000);

        worker.onmessage = (e) => {
          clearTimeout(timeoutId);
          worker.terminate();
          if (e.data.success) {
            resolve(e.data.schedules);
          } else {
            reject(new Error(e.data.error || 'Worker computation error'));
          }
        };

        worker.onerror = (err) => {
          clearTimeout(timeoutId);
          worker.terminate();
          // Fallback to synchronous execution
          resolve(generateSchedulesDFS(courseGroups, options));
        };

        worker.postMessage({ courseGroups, options });
      } catch (err) {
        resolve(generateSchedulesDFS(courseGroups, options));
      }
    });
  }
}
