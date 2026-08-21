import { isRecord } from '@/lib/helpers/is-record';

describe('isRecord', () => {
  it.each([{}, { a: 1 }, [], Object.create(null)])(
    'accepts %j, which can be read by key',
    (value) => {
      expect(isRecord(value)).toBe(true);
    },
  );

  it.each([null, undefined, 'text', 7, true])('rejects %j', (value) => {
    expect(isRecord(value)).toBe(false);
  });

  it('rejects an Error, which carries its message somewhere a key lookup will not find it', () => {
    expect(isRecord(new Error('boom'))).toBe(false);
  });

  it('rejects a subclass of Error too, so a thrown StudioError is not read as a body', () => {
    class Subclass extends Error {}

    expect(isRecord(new Subclass('boom'))).toBe(false);
  });
});
