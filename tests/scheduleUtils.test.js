import assert from 'node:assert/strict';
import test from 'node:test';
import { deduplicateSchedules, scheduleIdentity } from '../src/engine/scheduleUtils.js';

test('schedule identity is order-independent', () => {
  const a = { sections: [{ courseKey: 'CS101', section: '01' }, { courseKey: 'MATH1', section: '02' }] };
  const b = { sections: [{ courseKey: 'MATH1', section: '02' }, { courseKey: 'CS101', section: '01' }] };
  assert.equal(scheduleIdentity(a), scheduleIdentity(b));
});

test('duplicate schedules are removed', () => {
  const first = { sections: [{ courseKey: 'CS101', section: '01' }] };
  const duplicate = { sections: [{ courseKey: 'CS101', section: '01' }] };
  const different = { sections: [{ courseKey: 'CS101', section: '02' }] };
  assert.equal(deduplicateSchedules([first, duplicate, different]).length, 2);
});
