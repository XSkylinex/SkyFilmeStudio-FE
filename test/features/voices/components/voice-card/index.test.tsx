import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { VoiceCard } from '@/features/voices/components/voice-card';
import { renderInApp } from '../../../../render-in-app';
import { buildVoiceProfile } from '../../../../fixtures/voice-profile.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const renderCard = (approved: boolean): void => {
  renderInApp(
    <ul>
      <VoiceCard
        projectId={PROJECT_ID}
        voice={buildVoiceProfile({ displayName: 'Mira', approved })}
      />
    </ul>,
  );
};

describe('VoiceCard', () => {
  it('shows the frozen sentence and no edit control once approved', () => {
    renderCard(true);

    expect(screen.getByText(/approved, so it is frozen/)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Edit/ }),
    ).not.toBeInTheDocument();
  });

  it('offers editing on a draft voice, in place beside its approve control', async () => {
    const user = userEvent.setup();

    renderCard(false);

    expect(
      screen.queryByText(/approved, so it is frozen/),
    ).not.toBeInTheDocument();

    const editButton = screen.getByRole('button', { name: /^Edit/ });

    await user.click(editButton);

    expect(screen.getByLabelText('Display name')).toHaveValue('Mira');
    expect(
      screen.getByRole('button', { name: 'Save changes' }),
    ).toBeInTheDocument();
  });

  it('announces the approval it just made, and lands focus on it', async () => {
    const user = userEvent.setup();
    const draft = buildVoiceProfile({ displayName: 'Mira' });
    const approved = buildVoiceProfile({
      id: draft.id,
      displayName: 'Mira',
      approved: true,
    });

    server.use(
      http.post(API_PATH.approveVoiceProfile(PROJECT_ID, draft.id), () =>
        HttpResponse.json(approved),
      ),
    );

    const view = renderInApp(
      <ul>
        <VoiceCard projectId={PROJECT_ID} voice={draft} />
      </ul>,
    );

    await user.click(await screen.findByRole('button', { name: /^Approve/ }));

    view.rerender(
      <ul>
        <VoiceCard projectId={PROJECT_ID} voice={approved} />
      </ul>,
    );

    const announcement = await screen.findByText('Approved.');

    expect(announcement.tagName).toBe('OUTPUT');
    expect(announcement).toHaveFocus();
  });

  it('does not announce an approval it did not make', () => {
    renderCard(true);

    expect(screen.queryByText('Approved.')).not.toBeInTheDocument();
    expect(document.body).toHaveFocus();
  });
});
