// Solver Manager: dispatches tasks to a Web Worker with cancellation support.
import { generateSchedulesDFS } from './solver.worker.js';

export class ScheduleSolver {
  static activeSolve = null;

  static async solve(courseGroups, options = {}) {
    this.cancel();
    if (!courseGroups || courseGroups.length === 0) return [];

    if (typeof Worker !== 'undefined') {
      try {
        return await this._solveInWorker(courseGroups, options);
      } catch (workerErr) {
        if (workerErr?.name === 'AbortError') throw workerErr;
        console.warn('Web Worker failed; falling back to direct solver:', workerErr);
      }
    }

    return generateSchedulesDFS(courseGroups, options);
  }

  static cancel() {
    if (this.activeSolve) {
      this.activeSolve.worker.postMessage({ type: 'cancel' });
      this.activeSolve.worker.terminate();
      this.activeSolve.reject(Object.assign(new Error('Solve cancelled'), { name: 'AbortError' }));
      this.activeSolve = null;
    }
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
        if (this.activeSolve?.worker === worker) this.activeSolve = null;
        worker.terminate();
        callback(value);
      };

      this.activeSolve = { worker, reject: (err) => finish(reject, err) };

      worker.onmessage = (e) => {
        if (e.data.success) {
          finish(resolve, e.data.schedules);
        } else {
          finish(reject, new Error(e.data.error || 'Worker computation error'));
        }
      };

      worker.onerror = (err) => finish(reject, err);
      worker.postMessage({ courseGroups, options });
    });
  }
}
