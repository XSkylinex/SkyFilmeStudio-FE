import { isDocumentRequest } from '../../build/is-document-request';

describe('isDocumentRequest', () => {
  it('recognises a top-level navigation, which is what collides with an API prefix', () => {
    expect(
      isDocumentRequest({
        'sec-fetch-dest': 'document',
        accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
      }),
    ).toBe(true);
  });

  it("does not mistake the app's own fetch for a navigation", () => {
    expect(
      isDocumentRequest({
        'sec-fetch-dest': 'empty',
        accept: 'application/json',
      }),
    ).toBe(false);
  });

  it('trusts Sec-Fetch-Dest over Accept, so an XHR asking for html is still an XHR', () => {
    expect(
      isDocumentRequest({ 'sec-fetch-dest': 'empty', accept: 'text/html' }),
    ).toBe(false);
  });

  it('falls back to Accept for a client that sends no Sec-Fetch-Dest at all', () => {
    expect(isDocumentRequest({ accept: 'text/html' })).toBe(true);
    expect(isDocumentRequest({ accept: 'application/json' })).toBe(false);
    expect(isDocumentRequest({})).toBe(false);
  });
});
