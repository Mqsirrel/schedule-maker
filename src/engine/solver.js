// Solver Manager: dispatches tasks to a Web Worker with a safe direct fallback.
import { generateSchedulesDFS } from './solver.worker.js';

export class ScheduleSolver {
  /**
   * Solves for conflict-free schedules without blocking the UI when Workers
   * are available. The worker performs the expensive search and ranking.
   */
  static async solve(courseGroups, options = {}) {
    if (!courseGroups || courseGroups.length === 0) return [];

    if (typeof Worker !== 'undefined') {
      try {
        return await this._solveInWorker(courseGroups, options);
      } catch (workerErr) {
        console.warn('Web Worker failed; falling back to direct solver:', workerErr);
      }
    }

    return generateSchedulesDFS(courseGroups, options);
  }

  static _solveInWorker(courseGroups, options) {
    return new Promise((resolve, reject) => {
      let worker;

      try {
        worker = new Worker(new URL('./solver.worker.js', import.meta.url), { type: 'module' });
      } catch (err) {
        reject(err);
        return;
      }

      let settled = false;
      const finish = (callback, value) => {
        if (settled) return;
        settled = true;
        worker.terminate();
        callback(value);
      };

      worker.onmessage = (e) => {
        if (e.data.success) {
          finish(resolve, e.data.schedules);
        } else {
          finish(reject, new Error(e.data.error || 'Worker computation error'));
        }
      };

      worker.onerror = (err) => {
        finish(reject, err);
      };

      // Do not impose an arbitrary 10-second timeout. A timeout followed by a
      // synchronous DFS would freeze the exact UI the Worker was introduced to
      // protect. The worker is allowed to finish naturally or be superseded by
      // a future cancellable solve.
      worker.postMessage({ courseGroups, options });
    });
  }
}
