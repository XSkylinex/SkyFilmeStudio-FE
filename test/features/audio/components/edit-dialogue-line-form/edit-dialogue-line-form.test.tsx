import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { sceneIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { EditDialogueLineForm } from '@/features/audio/components/edit-dialogue-line-form';
import { buildDialogueLine } from '../../../../fixtures/dialogue-line.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';
import { renderInApp } from '../../../../render-in-app';

const server = mockOrchestratorServer();

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');

describe('EditDialogueLineForm', () => {
  it('cannot save an untouched line, because an empty patch is a no-op the orchestrator refuses', () => {
    renderInApp(
      <EditDialogueLineForm
        line={buildDialogueLine()}
        sceneId={SCENE_ID}
        onClose={() => undefined}
      />,
    );

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
    expect(screen.queryByLabelText('Language')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Voice')).not.toBeInTheDocument();
  });

  it('sends only the field that changed', async () => {
    const user = userEvent.setup();
    const line = buildDialogueLine();
    let body: unknown;
    server.use(
      http.patch(API_PATH.dialogueLine(line.id), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(buildDialogueLine({ pace: 'urgent' }));
      }),
    );
    renderInApp(
      <EditDialogueLineForm
        line={line}
        sceneId={SCENE_ID}
        onClose={() => undefined}
      />,
    );

    await user.clear(screen.getByLabelText('Pace'));
    await user.type(screen.getByLabelText('Pace'), 'urgent');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      /The line was saved/,
    );
    expect(body).toEqual({ pace: 'urgent' });
  });
});
