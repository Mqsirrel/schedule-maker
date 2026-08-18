import assert from 'node:assert/strict';
import test from 'node:test';
import { deduplicateSchedules, scheduleIdentity, normalizeArabic, diagnosePairwiseConflicts } from '../src/engine/scheduleUtils.js';

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

test('normalizeArabic handles hamza, yaa, and taa marbuta variants', () => {
  assert.equal(normalizeArabic('إسلامية'), 'اسلاميه');
  assert.equal(normalizeArabic('أحمد'), 'احمد');
  assert.equal(normalizeArabic('عَلِيّ'), 'علي');
});

test('diagnosePairwiseConflicts detects 100% overlapping course bottlenecks', () => {
  const course1 = {
    courseId: 'CS101',
    courseName: 'Computer Science',
    sections: [
      { days: ['su', 'tu'], timeSlots: [{ startMinutes: 480, endMinutes: 540 }] }
    ]
  };

  const course2 = {
    courseId: 'MATH101',
    courseName: 'Calculus',
    sections: [
      { days: ['su', 'tu'], timeSlots: [{ startMinutes: 480, endMinutes: 540 }] }
    ]
  };

  const course3 = {
    courseId: 'PHYS101',
    courseName: 'Physics',
    sections: [
      { days: ['mo', 'we'], timeSlots: [{ startMinutes: 600, endMinutes: 660 }] }
    ]
  };

  const bottlenecks = diagnosePairwiseConflicts([course1, course2, course3]);
  assert.equal(bottlenecks.length, 1);
  assert.equal(bottlenecks[0].courseA, 'Computer Science');
  assert.equal(bottlenecks[0].courseB, 'Calculus');
});
