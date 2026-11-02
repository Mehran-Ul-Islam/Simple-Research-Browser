const test = require('node:test');
const assert = require('node:assert');
const { resolveInput, isNavigable } = require('./url');

test('plain text becomes a Google search', () => {
  assert.strictEqual(resolveInput('electron ipc'), 'https://www.google.com/search?q=electron%20ipc');
});
test('domains get https, localhost gets http', () => {
  assert.strictEqual(resolveInput('example.com/a'), 'https://example.com/a');
  assert.strictEqual(resolveInput('localhost:3000'), 'http://localhost:3000');
});
test('full http(s) URLs pass through', () => {
  assert.strictEqual(resolveInput('https://a.dev/x?y=1'), 'https://a.dev/x?y=1');
});
test('dangerous schemes are searched, never navigated', () => {
  assert.ok(resolveInput('javascript:alert(1)').startsWith('https://www.google.com/search'));
  assert.ok(resolveInput('file:///etc/passwd').startsWith('https://www.google.com/search'));
  assert.strictEqual(isNavigable('file:///etc/passwd'), false);
});
test('empty input is null', () => assert.strictEqual(resolveInput('  '), null));
