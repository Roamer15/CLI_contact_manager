import test from 'node:test';
import assert from 'node:assert';
import { askUpdateQuestion } from '../command.mjs';

test('askUpdateQuestion should be a function', () => {
  assert.strictEqual(typeof askUpdateQuestion, 'function');
});