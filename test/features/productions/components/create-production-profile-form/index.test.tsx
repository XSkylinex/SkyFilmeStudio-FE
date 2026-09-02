import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { CreateProductionProfileForm } from '@/features/productions/components/create-production-profile-form';
import { buildProductionProfile } from '../../../../fixtures/production-profile.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const server = mockOrchestratorServer();

const capturePost = (): { body: () => unknown } => {
  let captured: unknown;
  server.use(
    http.post(API_PATH.productionProfiles(PROJECT_ID), async ({ request }) => {
      captured = await request.json();
      return HttpResponse.json(buildProductionProfile());
    }),
  );

  return { body: () => captured };
};

const fillRequired = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Name'), 'Twenty-minute episode');
  await user.type(screen.getByLabelText('Minutes'), '20');
  await user.type(screen.getByLabelText('Runtime tolerance in seconds'), '30');
  await user.type(screen.getByLabelText('Frames per second'), '24');
  await user.type(screen.getByLabelText('Width in pixels'), '1920');
  await user.type(screen.getByLabelText('Height in pixels'), '1080');
  await user.type(screen.getByLabelText('Aspect ratio'), '16:9');
  await user.type(screen.getByLabelText('Audio sample rate in Hz'), '48000');
  await user.type(screen.getByLabelText('Audio channels'), '2');
};

describe('CreateProductionProfileForm', () => {
  it('sends exactly what was typed, with sections numbered in order', async () => {
    const user = userEvent.setup();
    const posted = capturePost();

    renderInApp(
      <CreateProductionProfileForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await fillRequired(user);
    await user.click(screen.getByRole('button', { name: 'Add a section' }));
    await user.type(screen.getByLabelText('Label'), 'Titles');
    await user.type(screen.getByLabelText('Start in seconds'), '0');
    await user.type(screen.getByLabelText('End in seconds'), '30');
    await user.selectOptions(screen.getByLabelText('Reusable'), 'true');
    await user.click(
      screen.getByRole('button', { name: 'Create structure profile' }),
    );

    await waitFor(() => {
      expect(posted.body()).toBeDefined();
    });
    expect(posted.body()).toStrictEqual({
      name: 'Twenty-minute episode',
      targetRuntimeSeconds: 1_200,
      toleranceSeconds: 30,
      fps: 24,
      width: 1_920,
      height: 1_080,
      aspectRatio: '16:9',
      sampleRateHz: 48_000,
      audioChannels: 2,
      sections: [
        {
          order: 0,
          label: 'Titles',
          startSeconds: 0,
          endSeconds: 30,
          reusable: true,
        },
      ],
    });
  });

  it('assumes no format: an empty frame rate is refused on its field, not defaulted', async () => {
    const user = userEvent.setup();
    const posted = capturePost();

    renderInApp(
      <CreateProductionProfileForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await fillRequired(user);
    await user.clear(screen.getByLabelText('Frames per second'));
    await user.click(
      screen.getByRole('button', { name: 'Create structure profile' }),
    );

    expect(
      await screen.findByText(/Fields needing attention: 1/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Frames per second')).toBeInvalid();
    expect(screen.getByText('This needs a value.')).toBeInTheDocument();
    expect(posted.body()).toBeUndefined();
  });

  it('shows a section that ends before it starts against its end field', async () => {
    const user = userEvent.setup();
    const posted = capturePost();

    renderInApp(
      <CreateProductionProfileForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await fillRequired(user);
    await user.click(screen.getByRole('button', { name: 'Add a section' }));
    await user.type(screen.getByLabelText('Label'), 'Backwards');
    await user.type(screen.getByLabelText('Start in seconds'), '90');
    await user.type(screen.getByLabelText('End in seconds'), '10');
    await user.click(
      screen.getByRole('button', { name: 'Create structure profile' }),
    );

    await screen.findByText(/Fields needing attention: 1/);
    expect(screen.getByLabelText('End in seconds')).toBeInvalid();
    expect(posted.body()).toBeUndefined();
  });

  it('removes only the section whose control was pressed', async () => {
    const user = userEvent.setup();

    renderInApp(
      <CreateProductionProfileForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Add a section' }));
    await user.click(screen.getByRole('button', { name: 'Add a section' }));
    expect(screen.getByText('Section 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove section 1' }));

    expect(screen.queryByText('Section 2')).not.toBeInTheDocument();
    expect(screen.getByText('Section 1')).toBeInTheDocument();
  });

  it('announces the created profile and puts focus on the announcement', async () => {
    const user = userEvent.setup();
    capturePost();

    renderInApp(
      <CreateProductionProfileForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await fillRequired(user);
    await user.click(
      screen.getByRole('button', { name: 'Create structure profile' }),
    );

    const announcement = await screen.findByText('Created.');

    expect(announcement.tagName).toBe('OUTPUT');
    expect(announcement).toHaveFocus();
  });

  it('shows the orchestrator’s refusal of overlapping sections as a sentence a person can act on', async () => {
    const user = userEvent.setup();
    server.use(
      http.post(API_PATH.productionProfiles(PROJECT_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'PRODUCTION_PROFILE_SECTIONS_OVERLAP',
            message: 'two sections overlap',
          },
          { status: 409 },
        ),
      ),
    );

    renderInApp(
      <CreateProductionProfileForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await fillRequired(user);
    await user.click(
      screen.getByRole('button', { name: 'Create structure profile' }),
    );

    expect(
      await screen.findByText('The structure profile was not created'),
    ).toBeInTheDocument();
    expect(screen.getByText(/overlap/)).toBeInTheDocument();
  });
});
