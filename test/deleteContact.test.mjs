import test from 'node:test';
import assert from 'node:assert';
import { deleteContact } from '../command.mjs';

test('deleteContact should be a function', () => {
  assert.strictEqual(typeof deleteContact, 'function');
});