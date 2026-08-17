import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSchedulesDFS } from '../src/engine/solver.worker.js';

const slot = (startMinutes, endMinutes) => ({ startMinutes, endMinutes });

const section = (courseKey, sectionNumber, sundaySlots, availableSeats = 10) => ({
  courseKey,
  section: sectionNumber,
  courseName: courseKey,
  instructor: 'Test Instructor',
  isFull: availableSeats === 0,
  availableSeats,
  days: {
    su: sundaySlots,
    mo: [],
    tu: [],
    we: [],
    th: []
  }
});

test('rejects overlapping sections', () => {
  const groups = [
    [section('CS101', '01', [slot(8 * 60, 10 * 60)])],
    [section('CS102', '01', [slot(9 * 60, 11 * 60)])]
  ];

  assert.equal(generateSchedulesDFS(groups).length, 0);
});

test('returns valid schedules and ranks the one with fewer gaps higher', () => {
  const groups = [
    [
      section('CS101', '01', [slot(8 * 60, 10 * 60)]),
      section('CS101', '02', [slot(10 * 60, 12 * 60)])
    ],
    [
      section('CS102', '01', [slot(12 * 60, 14 * 60)]),
      section('CS102', '02', [slot(15 * 60, 17 * 60)])
    ]
  ];

  const schedules = generateSchedulesDFS(groups, { maxResults: 10 });

  assert.equal(schedules.length, 4);
  assert.ok(schedules[0].score >= schedules[1].score);
  assert.equal(schedules[0].rank, 1);
  assert.equal(schedules[0].metrics.totalGapMinutes, 0);
});

test('can exclude a section without changing other candidates', () => {
  const groups = [
    [
      section('CS101', '01', [slot(8 * 60, 10 * 60)]),
      section('CS101', '02', [slot(10 * 60, 12 * 60)])
    ],
    [section('CS102', '01', [slot(12 * 60, 14 * 60)])]
  ];

  const schedules = generateSchedulesDFS(groups, {
    excludedSections: [{ courseKey: 'CS101', section: '01' }]
  });

  assert.equal(schedules.length, 1);
  assert.equal(schedules[0].sections[0].section, '02');
});
