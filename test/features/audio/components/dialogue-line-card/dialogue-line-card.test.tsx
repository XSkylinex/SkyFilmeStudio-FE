import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  languageTagSchema,
  projectRelativePathSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { DialogueLineCard } from '@/features/audio/components/dialogue-line-card';
import { buildDialogueLine } from '../../../../fixtures/dialogue-line.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';
import { renderInApp } from '../../../../render-in-app';

const server = mockOrchestratorServer();

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');

const DRAFT_PATH = projectRelativePathSchema.parse(
  'productions/one/speech/line-1-draft-1.wav',
);

const FINAL_PATH = projectRelativePathSchema.parse(
  'productions/one/speech/line-1-final-1.wav',
);

const renderCard = (line = buildDialogueLine()) =>
  renderInApp(
    <ul>
      <DialogueLineCard line={line} sceneId={SCENE_ID} onRemoved={() => undefined} />
    </ul>,
  );

describe('DialogueLineCard', () => {
  it('offers no Approve on a line that has never been voiced, because that refusal arrives codeless', () => {
    renderCard(buildDialogueLine({ approved: false }));

    expect(
      screen.queryByRole('button', { name: /Approve this audio/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/never been voiced, so there is nothing to approve/),
    ).toBeInTheDocument();
  });

  it('offers Approve once the server says the line has audio, and never a client flag', () => {
    renderCard(
      buildDialogueLine({
        approved: false,
        generatedAudioPath: DRAFT_PATH,
      }),
    );

    expect(
      screen.getByRole('button', { name: 'Approve this audio for line 0' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Remove approval/ }),
    ).not.toBeInTheDocument();
  });

  it('offers only Remove approval on an approved line, because re-voicing one is refused', () => {
    renderCard(
      buildDialogueLine({
        approved: true,
        generatedAudioPath: FINAL_PATH,
      }),
    );

    expect(
      screen.getByRole('button', { name: 'Remove approval for line 0' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Approve this audio/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Generate draft/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Generate final/ }),
    ).not.toBeInTheDocument();
  });

  it('marks only the pass that is actually running as submitting', async () => {
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    server.use(
      http.post(
        API_PATH.dialogueLineSpeech(buildDialogueLine().id),
        async () => {
          await gate;
          return HttpResponse.json({ renderJobId: 'x', attempt: 1 });
        },
      ),
    );

    renderCard();
    await userEvent.click(
      screen.getByRole('button', { name: 'Generate final for line 0' }),
    );

    expect(
      screen.getByRole('button', { name: 'Generate draft for line 0' }),
    ).toHaveTextContent('Generate draft');
    expect(screen.getByText('Submitting…')).toBeInTheDocument();

    release?.();
    expect(
      await screen.findByText(/Submitted\. A take appears here/),
    ).toBeInTheDocument();
  });

  it('never announces an approval the refetched line does not carry', () => {
    const { rerender } = renderCard(
      buildDialogueLine({
        approved: true,
        generatedAudioPath: FINAL_PATH,
      }),
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    rerender(
      <ul>
        <DialogueLineCard
          line={buildDialogueLine({ approved: false })}
          sceneId={SCENE_ID}
        onRemoved={() => undefined}
        />
      </ul>,
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders a Hebrew line right-to-left inside the English shell', () => {
    renderCard(
      buildDialogueLine({
        language: languageTagSchema.parse('he'),
        text: 'הסדנה מעולם לא הייתה שקטה כל כך.',
      }),
    );

    const line = screen.getByText('הסדנה מעולם לא הייתה שקטה כל כך.');

    expect(line.closest('bdi')).toHaveAttribute('dir', 'rtl');
    expect(document.documentElement).not.toHaveAttribute('dir', 'rtl');
  });

  it('offers Edit on an unapproved line and never on an approved one, because editing is refused upstream', () => {
    const { rerender } = renderCard(buildDialogueLine({ approved: false }));
    expect(
      screen.getByRole('button', { name: 'Edit for line 0' }),
    ).toBeInTheDocument();

    rerender(
      <ul>
        <DialogueLineCard
          line={buildDialogueLine({
            approved: true,
            generatedAudioPath: FINAL_PATH,
          })}
          sceneId={SCENE_ID}
        onRemoved={() => undefined}
        />
      </ul>,
    );
    expect(
      screen.queryByRole('button', { name: /^Edit/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/frozen with it/)).toBeInTheDocument();
  });

  it('offers Delete only on a line that has never been voiced, since the route would orphan takes', () => {
    const { rerender } = renderCard(buildDialogueLine({ approved: false }));
    expect(
      screen.getByRole('button', { name: 'Delete for line 0' }),
    ).toBeInTheDocument();

    rerender(
      <ul>
        <DialogueLineCard
          line={buildDialogueLine({
            approved: false,
            generatedAudioPath: DRAFT_PATH,
          })}
          sceneId={SCENE_ID}
        onRemoved={() => undefined}
        />
      </ul>,
    );
    expect(
      screen.queryByRole('button', { name: /^Delete/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/takes would be orphaned/)).toBeInTheDocument();
  });
});
