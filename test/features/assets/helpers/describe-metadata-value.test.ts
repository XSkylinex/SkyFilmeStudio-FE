import { describeMetadataValue } from '@/features/assets/helpers/describe-metadata-value';

describe('describeMetadataValue', () => {
  it('passes a string through, because the orchestrator wrote it', () => {
    expect(describeMetadataValue('h264')).toBe('h264');
  });

  it.each([
    [0, '0'],
    [1920, '1920'],
    [23.976, '23.976'],
    [true, 'true'],
    [false, 'false'],
  ])('renders %j as %j without interpreting it', (value, expected) => {
    expect(describeMetadataValue(value)).toBe(expected);
  });

  it('keeps a nested object readable rather than dropping it', () => {
    expect(describeMetadataValue({ width: 1920, height: 1080 })).toBe(
      '{"width":1920,"height":1080}',
    );
  });

  it('keeps an array readable', () => {
    expect(describeMetadataValue(['video', 'audio'])).toBe('["video","audio"]');
  });

  it('drops an empty string rather than rendering an empty row', () => {
    expect(describeMetadataValue('')).toBeUndefined();
  });

  it('drops undefined', () => {
    expect(describeMetadataValue(undefined)).toBeUndefined();
  });

  it('renders null, because a recorded null is not the same as an absent key', () => {
    expect(describeMetadataValue(null)).toBe('null');
  });

  it('survives a value that cannot be serialised', () => {
    const circular: Record<string, unknown> = {};
    circular['self'] = circular;

    expect(describeMetadataValue(circular)).toBeUndefined();
  });
});
