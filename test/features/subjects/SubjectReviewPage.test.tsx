import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
const DRAFT_ID = canonicalAssetSetIdSchema.parse(
  '88888888-8888-4888-8888-888888888888',
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
    http.get(API_PATH.canonicalSets(PROJECT_ID, SUBJECT_ID), () =>
      HttpResponse.json([]),
    ),
  );
};

const servesOpenDraft = (): void => {
  server.use(
    http.get(API_PATH.canonicalSets(PROJECT_ID, SUBJECT_ID), () =>
      HttpResponse.json([
        buildCanonicalAssetSet({
          id: DRAFT_ID,
          approvalState: 'PENDING',
          notes: 'Turnaround gathered, awaiting review.',
        }),
      ]),
    ),
    http.get(
      API_PATH.canonicalReferences(PROJECT_ID, SUBJECT_ID, DRAFT_ID),
      () =>
        HttpResponse.json([
          buildCanonicalReference({ role: 'FRONT_VIEW', anchorEligible: true }),
        ]),
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

  it('offers approval of the open draft, named for the subject it belongs to', async () => {
    servesSubject();
    servesApprovedSet();
    servesOpenDraft();

    renderAt(PATH);

    expect(
      await screen.findByRole('button', {
        name: 'Approve the canonical set for Mira',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Reject the canonical set for Mira',
      }),
    ).not.toBeInTheDocument();
  });

  it('says a draft cannot be opened here rather than offering a control that fails', async () => {
    servesSubject();
    servesApprovedSet();

    renderAt(PATH);

    expect(
      await screen.findByRole('heading', { name: 'No open draft' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/does not publish/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Approve/ }),
    ).not.toBeInTheDocument();
  });

  it('waits for the server before letting the draft leave review', async () => {
    const user = userEvent.setup();
    let approvals = 0;
    servesSubject();
    servesApprovedSet();
    servesOpenDraft();
    server.use(
      http.post(
        API_PATH.approveCanonicalSet(PROJECT_ID, SUBJECT_ID, DRAFT_ID),
        async () => {
          approvals += 1;
          await new Promise((resolve) => setTimeout(resolve, 50));
          return HttpResponse.json(
            buildCanonicalAssetSet({ id: DRAFT_ID, approvalVersion: 3 }),
          );
        },
      ),
    );

    renderAt(PATH);
    const approveButton = await screen.findByRole('button', {
      name: 'Approve the canonical set for Mira',
    });
    await user.click(approveButton);

    expect(approveButton).toBeDisabled();
    await user.click(approveButton);
    await waitFor(() => {
      expect(approvals).toBe(1);
    });
  });

  it('shows the orchestrator’s own refusal when a draft has nothing to anchor to', async () => {
    const user = userEvent.setup();
    servesSubject();
    servesApprovedSet();
    servesOpenDraft();
    server.use(
      http.post(
        API_PATH.approveCanonicalSet(PROJECT_ID, SUBJECT_ID, DRAFT_ID),
        () =>
          HttpResponse.json(
            {
              statusCode: 400,
              code: 'CANONICAL_ANCHOR_REQUIRED',
              message: 'Canonical set has no references.',
            },
            { status: 400 },
          ),
      ),
    );

    renderAt(PATH);
    await user.click(
      await screen.findByRole('button', {
        name: 'Approve the canonical set for Mira',
      }),
    );

    expect(
      await screen.findByRole('heading', {
        name: 'This draft was not approved',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/without naming the approved reference/i),
    ).toBeInTheDocument();
  });

  it('never asks about a canonical set for a subject it could not read', async () => {
    let askedAboutTheSet = 0;
    server.use(
      http.get(API_PATH.projectSubject(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json(
          { statusCode: 404, message: 'no subject', error: 'Not Found' },
          { status: 404 },
        ),
      ),
      http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () => {
        askedAboutTheSet += 1;
        return HttpResponse.json(
          { statusCode: 404, message: 'no approved set', error: 'Not Found' },
          { status: 404 },
        );
      }),
    );

    renderAt(PATH);

    expect(
      await screen.findByRole('heading', {
        name: 'This subject could not be read',
      }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll('.skeleton')).toHaveLength(0);
    expect(askedAboutTheSet).toBe(0);
  });

  it('keeps a level-one heading on every branch, including the ones that failed', async () => {
    server.use(
      http.get(API_PATH.projectSubject(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json(
          { statusCode: 404, message: 'no subject', error: 'Not Found' },
          { status: 404 },
        ),
      ),
    );

    renderAt(PATH);

    expect(
      await screen.findByRole('heading', {
        name: 'This subject could not be read',
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it('refuses a subject id the orchestrator would reject, without asking it', () => {
    renderAt(`/projects/${PROJECT_ID}/subjects/not-a-uuid`);

    expect(
      screen.getByRole('heading', { name: 'That is not a subject id' }),
    ).toBeInTheDocument();
  });
});
