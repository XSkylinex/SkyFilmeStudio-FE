import { styleProfileIdSchema } from 'sky-filme-studio-be/contracts';
import { styleVersionDiff } from '@/features/styles/helpers/style-version-diff';
import { buildStyleProfile } from '../../../fixtures/style-profile.fixture';

describe('styleVersionDiff', () => {
  it('reports nothing between two identical versions', () => {
    const v1 = buildStyleProfile({ version: 1 });
    const v2 = buildStyleProfile({ version: 2, approved: true });

    expect(styleVersionDiff(v1, v2)).toEqual([]);
  });

  it('reports a rewritten text field as its old line removed and its new line added', () => {
    const v1 = buildStyleProfile({ description: 'Cold key light.' });
    const v2 = buildStyleProfile({ description: 'Warm key light.' });

    expect(styleVersionDiff(v1, v2)).toEqual([
      {
        field: 'description',
        removed: ['Cold key light.'],
        added: ['Warm key light.'],
      },
    ]);
  });

  it('reports only the rules that came or went, not the whole list', () => {
    const v1 = buildStyleProfile({ paletteRules: ['deep blues', 'no red'] });
    const v2 = buildStyleProfile({ paletteRules: ['deep blues', 'amber'] });

    expect(styleVersionDiff(v1, v2)).toEqual([
      { field: 'paletteRules', removed: ['no red'], added: ['amber'] },
    ]);
  });

  it('does not count reordering a list as a change', () => {
    const v1 = buildStyleProfile({ cameraRules: ['85mm', 'slow push-in'] });
    const v2 = buildStyleProfile({ cameraRules: ['slow push-in', '85mm'] });

    expect(styleVersionDiff(v1, v2)).toEqual([]);
  });

  it('shows a generation default by key and value, since the object has no other readable form', () => {
    const v1 = buildStyleProfile({ imageGenerationDefaults: { steps: 20 } });
    const v2 = buildStyleProfile({
      imageGenerationDefaults: { steps: 30, sampler: 'euler' },
    });

    expect(styleVersionDiff(v1, v2)).toEqual([
      {
        field: 'imageGenerationDefaults',
        removed: ['steps: 20'],
        added: ['steps: 30', 'sampler: "euler"'],
      },
    ]);
  });

  it('treats an absent realism level as no line, so setting one is one addition', () => {
    const v1 = buildStyleProfile();
    const v2 = buildStyleProfile({ realismLevel: 'stylised' });

    expect(styleVersionDiff(v1, v2)).toEqual([
      { field: 'realismLevel', removed: [], added: ['stylised'] },
    ]);
  });

  it('never reports version, approval or identity fields', () => {
    const v1 = buildStyleProfile({ version: 1, approved: true });
    const v2 = buildStyleProfile({
      version: 2,
      approved: false,
      id: styleProfileIdSchema.parse('22222222-2222-4222-8222-222222222222'),
    });

    expect(styleVersionDiff(v1, v2)).toEqual([]);
  });
});
