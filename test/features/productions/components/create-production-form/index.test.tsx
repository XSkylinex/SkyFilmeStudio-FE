import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import type { StyleProfile } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { CreateProductionForm } from '@/features/productions/components/create-production-form';
import { renderInApp } from '../../../../render-in-app';
import { buildProduction } from '../../../../fixtures/production.fixture';
import { buildStyleProfile } from '../../../../fixtures/style-profile.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const orchestratorServes = (
  styleProfileItems: readonly StyleProfile[],
): void => {
  server.use(
    http.get(API_PATH.styleProfiles(PROJECT_ID), () =>
      HttpResponse.json({ items: styleProfileItems }),
    ),
    http.get(API_PATH.productionProfiles(PROJECT_ID), () =>
      HttpResponse.json({ items: [] }),
    ),
  );
};

const renderForm = (onClose: () => void): void => {
  renderInApp(
    <CreateProductionForm projectId={PROJECT_ID} onClose={onClose} />,
  );
};

describe('CreateProductionForm', () => {
  it('blocks creation rather than rendering a form with no style to pin', async () => {
    orchestratorServes([]);

    renderForm(() => undefined);

    expect(
      await screen.findByRole('heading', {
        name: 'A production needs a style profile first',
      }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument();
  });

  it('still offers a way out of a blocked form', async () => {
    const onClose = vi.fn<() => void>();

    orchestratorServes([]);

    renderForm(onClose);

    await screen.findByRole('heading', {
      name: 'A production needs a style profile first',
    });
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('sends exactly what was typed, not a default twenty minutes', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn<() => void>();
    let created: unknown;

    orchestratorServes([buildStyleProfile()]);
    server.use(
      http.post(API_PATH.productions(PROJECT_ID), async ({ request }) => {
        created = await request.json();

        return HttpResponse.json(
          buildProduction({ title: 'Trailer', targetRuntimeSeconds: 30 }),
        );
      }),
    );

    renderForm(onClose);

    await user.type(await screen.findByLabelText('Title'), 'Trailer');
    await user.type(screen.getByLabelText('Seconds'), '30');
    await user.click(screen.getByRole('button', { name: 'Create production' }));

    const announcement = await screen.findByText('Created.');

    expect(announcement.tagName).toBe('OUTPUT');
    expect(announcement).toHaveFocus();
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);

    expect(created).toMatchObject({
      title: 'Trailer',
      targetRuntimeSeconds: 30,
      styleProfileId: '11111111-1111-4111-8111-111111111111',
    });
    expect(created).not.toHaveProperty('runtimeToleranceSeconds');
  });

  it('refuses to submit an empty title, and says so on the field itself', async () => {
    const user = userEvent.setup();

    orchestratorServes([buildStyleProfile()]);

    renderForm(() => undefined);

    await screen.findByLabelText('Title');
    await user.click(screen.getByRole('button', { name: 'Create production' }));

    expect(
      await screen.findByText(
        'The orchestrator’s own contract rejected this before it was sent.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });
});
