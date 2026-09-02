import { useState } from 'react';
import type { FC } from 'react';
import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  projectIdSchema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { BibleSubjectRulesEditor } from '@/features/bible/components/bible-subject-rules-editor';
import { EMPTY_SUBJECT_RULES_VALUES } from '@/features/bible/helpers/subject-rules-values';
import type { SubjectRulesValues } from '@/features/bible/interfaces/subject-rules-values';
import { buildSubject } from '../../../../fixtures/subject.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const MIRA_ID = subjectIdSchema.parse('11111111-1111-4111-8111-111111111111');
const TOVA_ID = subjectIdSchema.parse('22222222-2222-4222-8222-222222222222');

const server = mockOrchestratorServer(
  http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
    HttpResponse.json({
      items: [
        buildSubject({ id: MIRA_ID, displayName: 'Mira' }),
        buildSubject({ id: TOVA_ID, displayName: 'Tova' }),
      ],
    }),
  ),
);

interface HarnessProps {
  initial: readonly SubjectRulesValues[];
  onValue?: (next: readonly SubjectRulesValues[]) => void;
  errorFor?: (field: string) => string;
}

const Harness: FC<HarnessProps> = ({
  initial,
  onValue = () => undefined,
  errorFor = () => '',
}) => {
  const [value, setValue] = useState(initial);

  return (
    <BibleSubjectRulesEditor
      projectId={PROJECT_ID}
      value={value}
      onChange={(next) => {
        setValue(next);
        onValue(next);
      }}
      errorFor={errorFor}
    />
  );
};

const oneBlock = (
  overrides: Partial<SubjectRulesValues> = {},
): SubjectRulesValues => ({
  ...EMPTY_SUBJECT_RULES_VALUES,
  subjectId: MIRA_ID,
  ...overrides,
});

describe('BibleSubjectRulesEditor', () => {
  it('offers the project’s subjects by name, so a rule is attached to a person rather than an id', async () => {
    renderInApp(<Harness initial={[EMPTY_SUBJECT_RULES_VALUES]} />);

    expect(
      await screen.findByRole('option', { name: 'Mira' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(MIRA_ID)).not.toBeInTheDocument();
  });

  it('starts with no block and adds one on request', async () => {
    const user = userEvent.setup();
    renderInApp(<Harness initial={[]} />);

    expect(screen.queryByText('Subject rules 1')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Add rules for a subject' }),
    );

    expect(screen.getByText('Subject rules 1')).toBeInTheDocument();
  });

  it('reports the chosen subject and the typed rules through onChange', async () => {
    const user = userEvent.setup();
    const seen: (readonly SubjectRulesValues[])[] = [];
    renderInApp(
      <Harness
        initial={[EMPTY_SUBJECT_RULES_VALUES]}
        onValue={(next) => seen.push(next)}
      />,
    );

    await screen.findByRole('option', { name: 'Mira' });
    await user.selectOptions(screen.getByLabelText('Subject'), MIRA_ID);
    await user.type(
      screen.getByLabelText('Immutable visual traits'),
      'A chipped left horn',
    );

    expect(seen.at(-1)).toEqual([
      oneBlock({ immutableVisualTraits: 'A chipped left horn' }),
    ]);
  });

  it('removes only the block whose control was pressed', async () => {
    const user = userEvent.setup();
    const seen: (readonly SubjectRulesValues[])[] = [];
    renderInApp(
      <Harness
        initial={[
          oneBlock({ behaviourAndPersonality: 'Wary' }),
          oneBlock({ subjectId: TOVA_ID, behaviourAndPersonality: 'Bold' }),
        ]}
        onValue={(next) => seen.push(next)}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Remove subject rules 1' }),
    );

    expect(seen.at(-1)).toEqual([
      oneBlock({ subjectId: TOVA_ID, behaviourAndPersonality: 'Bold' }),
    ]);
    expect(screen.queryByText('Subject rules 2')).not.toBeInTheDocument();
  });

  it('says voice rules cannot apply while the subject does not speak, and stops saying so once it does', async () => {
    const user = userEvent.setup();
    renderInApp(<Harness initial={[oneBlock({ speaks: false })]} />);

    expect(
      screen.getByText(
        'This subject does not speak, so voice rules cannot apply to it.',
      ),
    ).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Speaks'), 'true');

    expect(
      screen.queryByText(
        'This subject does not speak, so voice rules cannot apply to it.',
      ),
    ).not.toBeInTheDocument();
  });

  it('adds a relationship to another named subject and removes it again', async () => {
    const user = userEvent.setup();
    const seen: (readonly SubjectRulesValues[])[] = [];
    renderInApp(
      <Harness initial={[oneBlock()]} onValue={(next) => seen.push(next)} />,
    );

    await screen.findByRole('option', { name: 'Mira' });
    await user.click(
      screen.getByRole('button', {
        name: 'Add a relationship to subject rules 1',
      }),
    );
    await user.selectOptions(await screen.findByLabelText('With'), TOVA_ID);
    await user.type(screen.getByLabelText('Relationship'), 'Older sister');

    expect(seen.at(-1)).toEqual([
      oneBlock({
        relationships: [{ subjectId: TOVA_ID, description: 'Older sister' }],
      }),
    ]);

    await user.click(
      screen.getByRole('button', {
        name: 'Remove relationship 1 from subject rules 1',
      }),
    );

    expect(seen.at(-1)).toEqual([oneBlock()]);
    expect(screen.queryByLabelText('With')).not.toBeInTheDocument();
  });

  it('shows the field’s own error beside the field it belongs to', () => {
    renderInApp(
      <Harness
        initial={[EMPTY_SUBJECT_RULES_VALUES]}
        errorFor={(field) =>
          field === 'subjectRules.0.subjectId' ? 'This needs a value.' : ''
        }
      />,
    );

    expect(screen.getByText('This needs a value.')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInvalid();
  });

  it('says so when the subject list it read was only the first page', async () => {
    server.use(
      http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
        HttpResponse.json({
          items: [buildSubject({ id: MIRA_ID, displayName: 'Mira' })],
          nextCursor: 'more',
        }),
      ),
    );
    renderInApp(<Harness initial={[]} />);

    expect(
      await screen.findByText(/first page of subjects only/i),
    ).toBeInTheDocument();
  });

  it('says so when the subject list cannot be read, and keeps the rules it already has', async () => {
    server.use(
      http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
        HttpResponse.json(
          { statusCode: 500, message: 'unavailable' },
          { status: 500 },
        ),
      ),
    );
    renderInApp(
      <Harness initial={[oneBlock({ behaviourAndPersonality: 'Wary' })]} />,
    );

    expect(
      await screen.findByText(/subjects could not be read/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Behaviour and personality')).toHaveValue(
      'Wary',
    );
  });
});
