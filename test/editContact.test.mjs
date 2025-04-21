import test from 'node:test';
import assert from 'node:assert';
import { editContact } from '../command.mjs';

test('editContact should be a function', () => {
  assert.strictEqual(typeof editContact, 'function');
});