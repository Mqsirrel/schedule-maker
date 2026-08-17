import assert from 'node:assert/strict';
import test from 'node:test';
import { TimetableParser } from '../src/engine/parser.js';

const html = `<table><tbody>
<tr><td>10</td><td>20</td><td></td><td></td><td>10:00 - 12:00</td><td></td><td></td><td>Dr Test</td><td>01</td><td>Networks</td><td>301</td><td>CS</td><td>Main</td><td>r1</td></tr>
</tbody></table>`;

test('Taibah parser normalizes a standard row', () => {
  const result = TimetableParser.parseHtml(html);
  assert.equal(result.success, true);
  assert.equal(result.sections.length, 1);
  assert.equal(result.sections[0].courseKey, 'CS-301');
  assert.equal(result.sections[0].section, '01');
  assert.equal(result.sections[0].availableSeats, 20);
  assert.equal(result.sections[0].instructor, 'Dr Test');
});

test('invalid input returns a structured parser error', () => {
  const result = TimetableParser.parseHtml('');
  assert.equal(result.success, false);
  assert.equal(result.error, 'empty_content');
});
