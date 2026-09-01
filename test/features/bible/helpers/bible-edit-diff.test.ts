import { styleProfileIdSchema } from 'sky-filme-studio-be/contracts';
import { bibleEditDiff } from '@/features/bible/helpers/bible-edit-diff';
import { bibleFormValuesFrom } from '@/features/bible/helpers/bible-form-values';
import { buildProjectBible } from '../../../fixtures/project-bible.fixture';

const STYLE_PROFILE_ID = styleProfileIdSchema.parse(
  '11111111-1111-4111-8111-111111111111',
);

describe('bibleEditDiff', () => {
  it('sends nothing when nothing was edited, so a no-op save cannot be submitted', () => {
    const bible = buildProjectBible({
      world: {
        genre: 'Documentary',
        contentBoundaries: ['No archive footage'],
        recurringThemes: [],
        introOutroRules: [],
        continuityConstraints: [],
      },
    });

    expect(bibleEditDiff(bible, bibleFormValuesFrom(bible), true)).toEqual({});
  });

  it('sends only the section that changed, because an absent key leaves that section alone', () => {
    const bible = buildProjectBible();
    const edited = { ...bibleFormValuesFrom(bible), tone: 'Restrained' };

    const patch = bibleEditDiff(bible, edited, true);

    expect(patch.world).toEqual({
      tone: 'Restrained',
      contentBoundaries: [],
      recurringThemes: [],
      introOutroRules: [],
      continuityConstraints: [],
    });
    expect(patch).not.toHaveProperty('audio');
    expect(patch).not.toHaveProperty('narrative');
    expect(patch).not.toHaveProperty('styleProfileId');
  });

  it('clears a narrative section with an explicit null rather than an empty object', () => {
    const bible = buildProjectBible({
      narrative: {
        worldRules: ['Gravity behaves'],
        chronology: 'Linear',
      },
    });
    const edited = {
      ...bibleFormValuesFrom(bible),
      narrativeWorldRules: '',
      chronology: '',
    };

    expect(bibleEditDiff(bible, edited, true).narrative).toBeNull();
  });

  it('never sends a narrative section for a kind that carries none, even when the fields differ', () => {
    const bible = buildProjectBible({ projectKind: 'MUSIC' });
    const edited = {
      ...bibleFormValuesFrom(bible),
      narrativeWorldRules: 'Something a music project cannot record',
    };

    expect(bibleEditDiff(bible, edited, false)).not.toHaveProperty('narrative');
  });

  it('clears a pinned style profile with null and sets a chosen one by id', () => {
    const pinned = buildProjectBible({ styleProfileId: STYLE_PROFILE_ID });

    expect(
      bibleEditDiff(
        pinned,
        { ...bibleFormValuesFrom(pinned), styleProfileId: '' },
        true,
      ).styleProfileId,
    ).toBeNull();

    const unpinned = buildProjectBible();

    expect(
      bibleEditDiff(
        unpinned,
        { ...bibleFormValuesFrom(unpinned), styleProfileId: STYLE_PROFILE_ID },
        true,
      ).styleProfileId,
    ).toBe(STYLE_PROFILE_ID);
  });

  it('does not count re-spacing a rule list as a change', () => {
    const bible = buildProjectBible({
      audio: {
        languages: [],
        recurringMotifs: ['A low brass figure', 'A single struck bell'],
        ambienceRules: [],
      },
    });
    const edited = {
      ...bibleFormValuesFrom(bible),
      recurringMotifs: '  A low brass figure  \n\n  A single struck bell  \n',
    };

    expect(bibleEditDiff(bible, edited, true)).toEqual({});
  });
});
