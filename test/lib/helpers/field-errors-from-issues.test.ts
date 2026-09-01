import { createProductionRequestSchema } from 'sky-filme-studio-be/contracts';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';

const VALID_BODY = {
  title: 'Pilot',
  productionKind: 'EPISODE',
  narrativeMode: 'SCREENPLAY',
  targetRuntimeSeconds: 1_200,
  styleProfileId: '11111111-1111-4111-8111-111111111111',
};

const failureFor = (body: Record<string, unknown>) => {
  const result = createProductionRequestSchema.safeParse({
    ...VALID_BODY,
    ...body,
  });

  if (result.success) {
    throw new Error('expected this body to fail validation');
  }

  return fieldErrorsFromIssues(result.error);
};

describe('fieldErrorsFromIssues', () => {
  it('keys the failure by the field that failed, and leaves the rest alone', () => {
    const errors = failureFor({ title: '' });

    expect(Object.keys(errors)).toEqual(['title']);
  });

  it('gives an empty required field a different sentence from a bad number', () => {
    const empty = failureFor({ title: '' });
    const negative = failureFor({ targetRuntimeSeconds: -5 });

    expect(empty['title']).toBe('form.invalid.required');
    expect(negative['targetRuntimeSeconds']).toBe('form.invalid.tooSmall');
  });

  it('returns a catalogue key rather than the library’s own English', () => {
    const errors = failureFor({ title: '' });
    const key = errors['title'];

    expect(key).toBeDefined();
    expect(EN_CATALOGUE[key as keyof typeof EN_CATALOGUE]).toBeTruthy();
    expect(key).not.toMatch(/expected|Too small|Invalid/);
  });

  it('maps two bad fields independently, without inventing a third', () => {
    const errors = failureFor({ title: '', targetRuntimeSeconds: -5 });

    expect(Object.keys(errors).sort()).toEqual([
      'targetRuntimeSeconds',
      'title',
    ]);
    expect(errors['productionKind']).toBeUndefined();
  });

  it('falls back to one sentence rather than leaking an unmapped code', () => {
    const errors = failureFor({ styleProfileId: 'not-a-uuid' });

    expect(errors['styleProfileId']).toBe('form.invalid.value');
  });
});
