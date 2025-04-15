import test from 'node:test';
import assert from 'node:assert';
import { listContacts } from '../command.mjs';

test('listContacts should be a function', () => {
  assert.strictEqual(typeof listContacts, 'function');
});