import test from 'node:test';
import assert from 'node:assert';
import { addContact } from '../command.mjs';

test('addContact should be a function', () => {
  assert.strictEqual(typeof addContact, 'function');
});
