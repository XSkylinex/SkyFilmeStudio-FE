import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import {
  projectIdSchema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { BibleSubjectRules } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { BibleSubjectRulesSection } from '@/features/bible/components/bible-subject-rules';
import { buildSubject } from '../../../../fixtures/subject.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const MIRA_ID = subjectIdSchema.parse('11111111-1111-4111-8111-111111111111');
const TOVA_ID = subjectIdSchema.parse('22222222-2222-4222-8222-222222222222');
const GONE_ID = subjectIdSchema.parse('99999999-9999-4999-8999-999999999999');

const server = mockOrchestratorServer(
  http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
    HttpResponse.json({
      items: [
        buildSubject({ id: MIRA_ID, displayName: 'Mira' }),
        buildSubject({ id: TOVA_ID, displayName: 'טובה' }),
      ],
    }),
  ),
);

const buildRules = (
  overrides: Partial<BibleSubjectRules> = {},
): BibleSubjectRules => ({
  subjectId: MIRA_ID,
  immutableVisualTraits: [],
  allowedVariations: [],
  prohibitedChanges: [],
  scaleRelationships: [],
  wardrobeVariants: [],
  speaks: true,
  voiceRules: [],
  relationships: [],
  ...overrides,
});

describe('BibleSubjectRulesSection', () => {
  it('names a subject from the project’s subject list rather than showing its id', async () => {
    renderInApp(
      <BibleSubjectRulesSection
        projectId={PROJECT_ID}
        subjectRules={[buildRules()]}
      />,
    );

    expect(
      await screen.findByRole('heading', { level: 3, name: 'Mira' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(MIRA_ID)).not.toBeInTheDocument();
  });

  it('names the other side of a relationship the same way', async () => {
    renderInApp(
      <BibleSubjectRulesSection
        projectId={PROJECT_ID}
        subjectRules={[
          buildRules({
            relationships: [
              { subjectId: TOVA_ID, description: 'Older sister' },
            ],
          }),
        ]}
      />,
    );

    expect(await screen.findByText('טובה')).toBeInTheDocument();
    expect(screen.getByText('Older sister')).toBeInTheDocument();
    expect(screen.queryByText(TOVA_ID)).not.toBeInTheDocument();
  });

  it('keeps the id, and says so, when no subject in the project carries it', async () => {
    renderInApp(
      <BibleSubjectRulesSection
        projectId={PROJECT_ID}
        subjectRules={[buildRules({ subjectId: GONE_ID })]}
      />,
    );

    expect(
      await screen.findByText('No subject in this project carries this id.'),
    ).toBeInTheDocument();
    expect(screen.getByText(GONE_ID)).toBeInTheDocument();
  });

  it('does not call a subject missing when the list it read was only the first page', async () => {
    server.use(
      http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
        HttpResponse.json({
          items: [buildSubject({ id: MIRA_ID, displayName: 'Mira' })],
          nextCursor: 'more',
        }),
      ),
    );

    renderInApp(
      <BibleSubjectRulesSection
        projectId={PROJECT_ID}
        subjectRules={[buildRules(), buildRules({ subjectId: GONE_ID })]}
      />,
    );

    expect(
      await screen.findByRole('heading', { level: 3, name: 'Mira' }),
    ).toBeInTheDocument();
    expect(screen.getByText(GONE_ID)).toBeInTheDocument();
    expect(
      screen.queryByText('No subject in this project carries this id.'),
    ).not.toBeInTheDocument();
  });

  it('keeps the id when the subject list cannot be read', async () => {
    server.use(
      http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
        HttpResponse.json(
          { statusCode: 500, message: 'unavailable' },
          { status: 500 },
        ),
      ),
    );

    renderInApp(
      <BibleSubjectRulesSection
        projectId={PROJECT_ID}
        subjectRules={[buildRules()]}
      />,
    );

    expect(await screen.findByText(MIRA_ID)).toBeInTheDocument();
    expect(
      screen.queryByText('No subject in this project carries this id.'),
    ).not.toBeInTheDocument();
  });

  it('says voice rules cannot apply to a subject that does not speak', async () => {
    renderInApp(
      <BibleSubjectRulesSection
        projectId={PROJECT_ID}
        subjectRules={[buildRules({ speaks: false })]}
      />,
    );

    expect(
      await screen.findByText(
        'This subject does not speak, so voice rules cannot apply to it.',
      ),
    ).toBeInTheDocument();
  });

  it('shows a speaking subject its voice rules instead', async () => {
    renderInApp(
      <BibleSubjectRulesSection
        projectId={PROJECT_ID}
        subjectRules={[
          buildRules({ speaks: true, voiceRules: ['Never shouts'] }),
        ]}
      />,
    );

    expect(await screen.findByText('Never shouts')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'This subject does not speak, so voice rules cannot apply to it.',
      ),
    ).not.toBeInTheDocument();
  });

  it('says so when no subject carries rules at all', async () => {
    renderInApp(
      <BibleSubjectRulesSection projectId={PROJECT_ID} subjectRules={[]} />,
    );

    expect(
      await screen.findByText('No subject carries rules on this version.'),
    ).toBeInTheDocument();
  });
});
