import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  canonicalAssetSetIdSchema,
  projectIdSchema,
  sha256Schema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { SubjectReviewPage } from '@/features/subjects/SubjectReviewPage';
import { renderInApp } from '../../render-in-app';
import { buildSubject } from '../../fixtures/subject.fixture';
import { buildCanonicalAssetSet } from '../../fixtures/canonical-asset-set.fixture';
import { buildCanonicalReference } from '../../fixtures/canonical-reference.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

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

const FROZEN_SHA = sha256Schema.parse('b'.repeat(64));

const PATH = `/projects/${PROJECT_ID}/subjects/${SUBJECT_ID}`;

const renderAt = (path: string): void => {
  renderInApp(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/projects/:projectId/subjects/:subjectId"
          element={<SubjectReviewPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

const servesSubject = (
  overrides: Partial<ReturnType<typeof buildSubject>> = {},
): void => {
  server.use(
    http.get(API_PATH.projectSubject(PROJECT_ID, SUBJECT_ID), () =>
      HttpResponse.json(buildSubject(overrides)),
    ),
  );
};

const servesNoApprovedSet = (): void => {
  server.use(
    http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () =>
      HttpResponse.json(
        { statusCode: 404, message: 'no approved set', error: 'Not Found' },
        { status: 404 },
      ),
    ),
  );
};

const servesApprovedSet = (): void => {
  server.use(
    http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () =>
      HttpResponse.json(
        buildCanonicalAssetSet({
          approvalVersion: 2,
          approvedAt: '2026-08-16T11:00:00.000Z',
          frozenDescriptor: 'Short dark hair, brown eyes, green jacket.',
          frozenDescriptorSha256: FROZEN_SHA,
        }),
      ),
    ),
    http.get(API_PATH.canonicalReferences(PROJECT_ID, SUBJECT_ID, SET_ID), () =>
      HttpResponse.json([
        buildCanonicalReference({ role: 'FRONT_VIEW', anchorEligible: true }),
      ]),
    ),
  );
};

describe('SubjectReviewPage', () => {
  it('leads with what must not change, because that is what review is for', async () => {
    servesSubject();
    servesNoApprovedSet();

    renderAt(PATH);

    expect(
      await screen.findByRole('heading', { name: 'What must not change' }),
    ).toBeInTheDocument();
    expect(screen.getByText('short dark hair')).toBeInTheDocument();
    expect(screen.getByText('hair colour')).toBeInTheDocument();
  });

  it('says generation is blocked when no set is approved, rather than staying silent', async () => {
    servesSubject();
    servesNoApprovedSet();

    renderAt(PATH);

    expect(
      await screen.findByRole('heading', { name: 'No approved set' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Generation is blocked/i)).toBeInTheDocument();
  });

  it('never claims there is no approved set while it is still asking', () => {
    servesSubject();
    servesNoApprovedSet();

    renderAt(PATH);

    expect(
      screen.queryByRole('heading', { name: 'No approved set' }),
    ).not.toBeInTheDocument();
  });

  it('shows the approval version and the frozen descriptor that pins a production', async () => {
    servesSubject();
    servesApprovedSet();

    renderAt(PATH);

    expect(await screen.findByText('Approved')).toBeInTheDocument();
    expect(
      screen.getByText('Short dark hair, brown eyes, green jacket.'),
    ).toBeInTheDocument();
    expect(screen.getByText(FROZEN_SHA)).toBeInTheDocument();
  });

  it('marks which references a generation may anchor to', async () => {
    servesSubject();
    servesApprovedSet();

    renderAt(PATH);

    expect(await screen.findByText('Front')).toBeInTheDocument();
    expect(screen.getByText('Anchor eligible')).toBeInTheDocument();
  });

  it('says approving is unwired rather than offering a control that does nothing', async () => {
    servesSubject();
    servesApprovedSet();

    renderAt(PATH);

    expect(
      await screen.findByText(/Approving a set is not wired up/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /approve/i }),
    ).not.toBeInTheDocument();
  });

  it('refuses a subject id the orchestrator would reject, without asking it', () => {
    renderAt(`/projects/${PROJECT_ID}/subjects/not-a-uuid`);

    expect(
      screen.getByRole('heading', { name: 'That is not a subject id' }),
    ).toBeInTheDocument();
  });
});
