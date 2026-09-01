import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import {
  canonicalAssetSetIdSchema,
  canonicalReferenceIdSchema,
  projectIdSchema,
  sourceAssetIdSchema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { CanonicalComparison } from '@/features/subjects/components/canonical-comparison';
import { buildCanonicalAssetSet } from '../../../../fixtures/canonical-asset-set.fixture';
import { buildCanonicalReference } from '../../../../fixtures/canonical-reference.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';
import { renderInApp } from '../../../../render-in-app';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const SUBJECT_ID = subjectIdSchema.parse(
  '66666666-6666-4666-8666-666666666666',
);
const SET_ID = canonicalAssetSetIdSchema.parse(
  '77777777-7777-4777-8777-777777777777',
);
const DRAFT_ID = canonicalAssetSetIdSchema.parse(
  '88888888-8888-4888-8888-888888888888',
);
const DRAFT_ASSET_ID = sourceAssetIdSchema.parse(
  '22222222-2222-4222-8222-222222222222',
);

const approvedSet = buildCanonicalAssetSet({ id: SET_ID });
const draftSet = buildCanonicalAssetSet({
  id: DRAFT_ID,
  approvalState: 'PENDING',
});

const render = (): void => {
  renderInApp(
    <CanonicalComparison projectId={PROJECT_ID} subjectId={SUBJECT_ID} />,
  );
};

describe('CanonicalComparison', () => {
  it('pairs the approved and draft references by role, large enough to judge drift', async () => {
    server.use(
      http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json(approvedSet),
      ),
      http.get(API_PATH.canonicalSets(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json([approvedSet, draftSet]),
      ),
      http.get(
        API_PATH.canonicalReferences(PROJECT_ID, SUBJECT_ID, SET_ID),
        () =>
          HttpResponse.json([buildCanonicalReference({ role: 'FRONT_VIEW' })]),
      ),
      http.get(
        API_PATH.canonicalReferences(PROJECT_ID, SUBJECT_ID, DRAFT_ID),
        () =>
          HttpResponse.json([
            buildCanonicalReference({
              id: canonicalReferenceIdSchema.parse(
                '99999999-9999-4999-8999-999999999999',
              ),
              canonicalAssetSetId: DRAFT_ID,
              role: 'FRONT_VIEW',
              sourceAssetId: DRAFT_ASSET_ID,
            }),
          ]),
      ),
    );

    render();

    expect(
      await screen.findByRole('heading', {
        name: 'Approved against the draft',
        level: 2,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('img', { name: 'Approved Front reference' }),
    ).toHaveAttribute('src', expect.stringContaining('11111111-1111-4111'));
    expect(
      await screen.findByRole('img', { name: 'Draft Front reference' }),
    ).toHaveAttribute('src', expect.stringContaining(DRAFT_ASSET_ID));
  });

  it('says which side lacks a role rather than leaving a blank cell', async () => {
    server.use(
      http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json(approvedSet),
      ),
      http.get(API_PATH.canonicalSets(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json([approvedSet, draftSet]),
      ),
      http.get(
        API_PATH.canonicalReferences(PROJECT_ID, SUBJECT_ID, SET_ID),
        () =>
          HttpResponse.json([buildCanonicalReference({ role: 'REAR_VIEW' })]),
      ),
      http.get(
        API_PATH.canonicalReferences(PROJECT_ID, SUBJECT_ID, DRAFT_ID),
        () => HttpResponse.json([]),
      ),
    );

    render();

    expect(
      await screen.findByText('No Rear reference on the Draft side'),
    ).toBeInTheDocument();
  });

  it('explains itself when there is a draft and nothing approved to hold it against', async () => {
    server.use(
      http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json(
          { statusCode: 404, message: 'none' },
          { status: 404 },
        ),
      ),
      http.get(API_PATH.canonicalSets(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json([draftSet]),
      ),
    );

    render();

    expect(
      await screen.findByText(
        /no approved set yet, so there is nothing to compare/,
      ),
    ).toBeInTheDocument();
  });

  it('renders nothing at all when the subject has neither', async () => {
    server.use(
      http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json(
          { statusCode: 404, message: 'none' },
          { status: 404 },
        ),
      ),
      http.get(API_PATH.canonicalSets(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json([]),
      ),
    );

    render();

    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
    expect(
      screen.queryByRole('heading', { name: 'Approved against the draft' }),
    ).not.toBeInTheDocument();
  });
});
