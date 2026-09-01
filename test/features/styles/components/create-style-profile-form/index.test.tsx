import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  projectIdSchema,
  styleModeSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { CreateStyleProfileForm } from '@/features/styles/components/create-style-profile-form';
import { renderInApp } from '../../../../render-in-app';
import { buildStyleProfile } from '../../../../fixtures/style-profile.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const MODE = styleModeSchema.parse('TEST_MODE');

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

describe('CreateStyleProfileForm', () => {
  it('parses what was typed through the create contract and sends exactly that', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn<() => void>();
    let created: unknown;

    server.use(
      http.post(API_PATH.styleProfiles(PROJECT_ID), async ({ request }) => {
        created = await request.json();

        return HttpResponse.json(
          buildStyleProfile({ name: 'Nightfall', mode: MODE }),
        );
      }),
    );

    renderInApp(
      <CreateStyleProfileForm projectId={PROJECT_ID} onClose={onClose} />,
    );

    await user.type(screen.getByLabelText('Name'), 'Nightfall');
    await user.type(
      screen.getByLabelText('Canonical description'),
      'Cold key light.',
    );
    await user.type(screen.getByLabelText('Style mode'), 'TEST_MODE');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(screen.getByText('Created.')).toBeInTheDocument();
    });

    expect(created).toEqual({
      name: 'Nightfall',
      description: 'Cold key light.',
      mode: MODE,
      referenceAssetIds: [],
      paletteRules: [],
      lightingRules: [],
      cameraRules: [],
      textureRules: [],
      motionRules: [],
      prohibitedStyleDrift: [],
      imageGenerationDefaults: {},
      videoGenerationDefaults: {},
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('offers the contract’s own suggestions with none preselected', async () => {
    const user = userEvent.setup();

    renderInApp(
      <CreateStyleProfileForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    expect(screen.getByLabelText('Style mode')).toHaveValue('');

    await user.click(screen.getByRole('button', { name: 'SOURCE_FAITHFUL' }));

    expect(screen.getByLabelText('Style mode')).toHaveValue('SOURCE_FAITHFUL');
  });

  it('refuses to submit an empty name, and says so on the field itself', async () => {
    const user = userEvent.setup();

    renderInApp(
      <CreateStyleProfileForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await user.type(screen.getByLabelText('Style mode'), 'TEST_MODE');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByLabelText('Name')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('still offers a way out without submitting anything', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn<() => void>();

    renderInApp(
      <CreateStyleProfileForm projectId={PROJECT_ID} onClose={onClose} />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
