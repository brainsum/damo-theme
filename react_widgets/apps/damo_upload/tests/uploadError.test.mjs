// Run with Node 22.18+ or Node 24+: node --test tests/uploadError.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uploadErrorMessage } from '../src/services/uploadError.ts';

const fallback = 'The file could not be uploaded';
test('shows the actual Drupal file size and limit', () => {
  assert.equal(
    uploadErrorMessage(
      422,
      JSON.stringify({
        errors: [
          {
            detail:
              'Unprocessable Entity: file validation failed.\nThe file is 24.11 MB exceeding the maximum file size of 10 MB.',
          },
        ],
      }),
      fallback
    ),
    'The file is 24.11 MB exceeding the maximum file size of 10 MB.'
  );
});
test('preserves and deduplicates multiple field validation errors', () => {
  const errors = [
    'Only JPEG files are allowed.',
    'A category is required.',
    'A category is required.',
  ].map((detail) => ({ detail }));
  assert.equal(
    uploadErrorMessage(422, JSON.stringify({ errors }), fallback),
    'Only JPEG files are allowed. A category is required.'
  );
});
test('handles HTML proxy responses without exposing markup', () => {
  assert.match(
    uploadErrorMessage(413, '<html>nginx error</html>', fallback),
    /server upload limit/
  );
  assert.match(
    uploadErrorMessage(502, '<html>private stack trace</html>', fallback),
    /HTTP 502/
  );
  assert.doesNotMatch(
    uploadErrorMessage(502, '<html>private stack trace</html>', fallback),
    /private|<html>/
  );
});
test('malformed or missing JSON errors still produce a message', () => {
  for (const body of [
    '',
    '{broken',
    'null',
    '{"errors":null}',
    '{"errors":[null,{}, {"detail":3}]}',
  ]) {
    assert.match(uploadErrorMessage(422, body, fallback), /HTTP 422/);
  }
});
test('distinguishes network, session, and rate-limit failures', () => {
  assert.match(uploadErrorMessage(0, '', fallback), /connection/);
  assert.match(uploadErrorMessage(403, '', fallback), /Sign in again/);
  assert.match(uploadErrorMessage(429, '', fallback), /Wait a moment/);
});
