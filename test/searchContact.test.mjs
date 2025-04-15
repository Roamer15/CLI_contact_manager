import test from 'node:test';
import assert from 'node:assert';
import { searchContact } from '../command.mjs';

test('searchContact should be a function', () => {
  assert.strictEqual(typeof searchContact, 'function');
});