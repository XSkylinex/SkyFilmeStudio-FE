import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { EditVoiceProfileForm } from '@/features/voices/components/edit-voice-profile-form';
import { renderInApp } from '../../../../render-in-app';
import { buildVoiceProfile } from '../../../../fixtures/voice-profile.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

describe('EditVoiceProfileForm', () => {
  it('disables saving until something actually changed, since a no-op patch is a 400', () => {
    const voiceProfile = buildVoiceProfile();

    renderInApp(
      <EditVoiceProfileForm
        projectId={PROJECT_ID}
        voiceProfile={voiceProfile}
        onClose={() => undefined}
      />,
    );

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });

  it('sends only the field that changed, never the whole profile', async () => {
    const user = userEvent.setup();
    const voiceProfile = buildVoiceProfile();
    let patched: unknown;

    server.use(
      http.patch(
        API_PATH.voiceProfile(PROJECT_ID, voiceProfile.id),
        async ({ request }) => {
          patched = await request.json();

          return HttpResponse.json(
            buildVoiceProfile({ displayName: 'Mira Renamed' }),
          );
        },
      ),
    );

    renderInApp(
      <EditVoiceProfileForm
        projectId={PROJECT_ID}
        voiceProfile={voiceProfile}
        onClose={() => undefined}
      />,
    );

    const displayName = screen.getByLabelText('Display name');

    await user.clear(displayName);
    await user.type(displayName, 'Mira Renamed');

    const saveButton = screen.getByRole('button', { name: 'Save changes' });

    expect(saveButton).toBeEnabled();
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Saved.')).toBeInTheDocument();
    });

    expect(patched).toEqual({ displayName: 'Mira Renamed' });
  });
});
