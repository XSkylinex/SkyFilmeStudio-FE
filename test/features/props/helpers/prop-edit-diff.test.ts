import { propEditDiff } from '@/features/props/helpers/prop-edit-diff';
import { buildProp } from '../../../fixtures/prop.fixture';

describe('propEditDiff', () => {
  it('is empty when nothing changed', () => {
    const prop = buildProp();

    expect(
      propEditDiff(prop, {
        name: prop.name,
        canonicalDescription: prop.canonicalDescription,
        continuityRules: prop.continuityRules,
      }),
    ).toEqual({});
  });

  it('carries only the field that changed', () => {
    const prop = buildProp();

    expect(
      propEditDiff(prop, {
        name: prop.name,
        canonicalDescription: 'A dented brass compass, glass now missing.',
        continuityRules: prop.continuityRules,
      }),
    ).toEqual({
      canonicalDescription: 'A dented brass compass, glass now missing.',
    });
  });

  it('treats a changed continuityRules array as a change', () => {
    const prop = buildProp({
      continuityRules: ['the glass stays cracked after scene 4'],
    });

    expect(
      propEditDiff(prop, {
        name: prop.name,
        canonicalDescription: prop.canonicalDescription,
        continuityRules: [],
      }),
    ).toEqual({ continuityRules: [] });
  });
});
