import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { CreateVoiceProfileForm } from '@/features/voices/components/create-voice-profile-form';
import { renderInApp } from '../../../../render-in-app';
import { buildVoiceProfile } from '../../../../fixtures/voice-profile.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

describe('CreateVoiceProfileForm', () => {
  it('parses what was typed through the create contract and sends exactly that', async () => {
    const user = userEvent.setup();
    let created: unknown;

    server.use(
      http.post(API_PATH.voiceProfiles(PROJECT_ID), async ({ request }) => {
        created = await request.json();

        return HttpResponse.json(buildVoiceProfile({ displayName: 'Mira' }));
      }),
    );

    renderInApp(
      <CreateVoiceProfileForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await user.type(screen.getByLabelText('Display name'), 'Mira');
    await user.type(screen.getByLabelText('Engine'), 'moss-tts');
    await user.type(screen.getByLabelText('Model id'), 'moss-ttsd-v0.5');
    await user.type(screen.getByLabelText('Language tag'), 'en-GB');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(screen.getByText('Created.')).toBeInTheDocument();
    });

    expect(created).toEqual({
      displayName: 'Mira',
      engine: 'moss-tts',
      modelId: 'moss-ttsd-v0.5',
      language: 'en-GB',
      additionalLanguages: [],
      generationParameters: {},
    });
  });

  it('refuses a language tag that is not BCP-47, and says so on the field', async () => {
    const user = userEvent.setup();

    renderInApp(
      <CreateVoiceProfileForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await user.type(screen.getByLabelText('Display name'), 'Mira');
    await user.type(screen.getByLabelText('Engine'), 'moss-tts');
    await user.type(screen.getByLabelText('Model id'), 'moss-ttsd-v0.5');
    await user.type(screen.getByLabelText('Language tag'), 'not a tag');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByLabelText('Language tag')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });
});
