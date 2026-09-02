import {
  productionProfileIdSchema,
  updateProductionRequestSchema,
} from 'sky-filme-studio-be/contracts';
import {
  productionEditDiff,
  unclearableFields,
} from '@/features/productions/helpers/production-edit-diff';
import { productionEditValuesFrom } from '@/features/productions/helpers/production-edit-values';
import { buildProduction } from '../../../fixtures/production.fixture';

const PROFILE_ID = productionProfileIdSchema.parse(
  '22222222-2222-4222-8222-222222222222',
);

describe('productionEditValuesFrom', () => {
  it('splits the target runtime into the minutes and seconds boxes the form shows', () => {
    const values = productionEditValuesFrom(
      buildProduction({ targetRuntimeSeconds: 754 }),
    );

    expect(values.minutes).toBe('12');
    expect(values.seconds).toBe('34');
  });

  it('shows an absent optional field as an empty box', () => {
    const values = productionEditValuesFrom(buildProduction());

    expect(values.logline).toBe('');
    expect(values.productionProfileId).toBe('');
    expect(values.sequenceNumber).toBe('');
  });
});

describe('productionEditDiff', () => {
  it('sends nothing when nothing changed, which the update refuses as a body', () => {
    const production = buildProduction({ logline: 'A pilot.' });

    const patch = productionEditDiff(
      production,
      productionEditValuesFrom(production),
    );

    expect(patch).toStrictEqual({});
    expect(updateProductionRequestSchema.safeParse(patch).success).toBe(false);
  });

  it('sends only the field that changed', () => {
    const production = buildProduction();

    const patch = productionEditDiff(production, {
      ...productionEditValuesFrom(production),
      title: 'Pilot, revised',
    });

    expect(patch).toStrictEqual({ title: 'Pilot, revised' });
    expect(updateProductionRequestSchema.safeParse(patch).success).toBe(true);
  });

  it('recomposes the target runtime from both boxes', () => {
    const production = buildProduction({ targetRuntimeSeconds: 1_200 });

    expect(
      productionEditDiff(production, {
        ...productionEditValuesFrom(production),
        minutes: '20',
        seconds: '30',
      }),
    ).toStrictEqual({ targetRuntimeSeconds: 1_230 });
  });

  it('sets an optional field that was absent', () => {
    const production = buildProduction();

    expect(
      productionEditDiff(production, {
        ...productionEditValuesFrom(production),
        productionProfileId: PROFILE_ID,
        sequenceNumber: '3',
      }),
    ).toStrictEqual({ productionProfileId: PROFILE_ID, sequenceNumber: 3 });
  });

  it('leaves an emptied optional field alone rather than inventing a way to clear it', () => {
    const production = buildProduction({
      logline: 'A pilot.',
      runtimeToleranceSeconds: 30,
    });

    const patch = productionEditDiff(production, {
      ...productionEditValuesFrom(production),
      logline: '',
      tolerance: '',
    });

    expect(patch).toStrictEqual({});
  });
});

describe('unclearableFields', () => {
  it('names the fields a person emptied that the wire cannot empty', () => {
    const production = buildProduction({
      logline: 'A pilot.',
      brief: 'Two friends.',
      runtimeToleranceSeconds: 30,
    });

    expect(
      unclearableFields(production, {
        ...productionEditValuesFrom(production),
        logline: '',
        tolerance: '',
      }),
    ).toEqual(['logline', 'tolerance']);
  });

  it('names nothing when an empty box was empty to begin with', () => {
    const production = buildProduction();

    expect(
      unclearableFields(production, productionEditValuesFrom(production)),
    ).toEqual([]);
  });
});
