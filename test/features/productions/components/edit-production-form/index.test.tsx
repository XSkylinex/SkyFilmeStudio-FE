import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { EditProductionForm } from '@/features/productions/components/edit-production-form';
import { buildProduction } from '../../../../fixtures/production.fixture';
import { buildStyleProfile } from '../../../../fixtures/style-profile.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const server = mockOrchestratorServer(
  http.get(API_PATH.styleProfiles(PROJECT_ID), () =>
    HttpResponse.json({ items: [buildStyleProfile()] }),
  ),
  http.get(API_PATH.productionProfiles(PROJECT_ID), () =>
    HttpResponse.json({ items: [] }),
  ),
);

const capturePatch = (
  production: ReturnType<typeof buildProduction>,
  respondWith = production,
): { body: () => unknown } => {
  let captured: unknown;
  server.use(
    http.patch(
      API_PATH.production(PROJECT_ID, production.id),
      async ({ request }) => {
        captured = await request.json();
        return HttpResponse.json(respondWith);
      },
    ),
  );

  return { body: () => captured };
};

describe('EditProductionForm', () => {
  it('refuses to submit an untouched form, because the orchestrator rejects an empty body', async () => {
    renderInApp(
      <EditProductionForm
        projectId={PROJECT_ID}
        production={buildProduction()}
        onClose={() => undefined}
      />,
    );

    expect(
      await screen.findByRole('button', { name: 'Save changes' }),
    ).toBeDisabled();
  });

  it('sends only the field that was changed', async () => {
    const user = userEvent.setup();
    const production = buildProduction({ logline: 'A pilot.' });
    const patched = capturePatch(production);

    renderInApp(
      <EditProductionForm
        projectId={PROJECT_ID}
        production={production}
        onClose={() => undefined}
      />,
    );

    await user.clear(await screen.findByLabelText('Title'));
    await user.type(screen.getByLabelText('Title'), 'Pilot, revised');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(patched.body()).toBeDefined();
    });
    expect(patched.body()).toStrictEqual({ title: 'Pilot, revised' });
  });

  it('recomposes the target runtime from both boxes and sends seconds', async () => {
    const user = userEvent.setup();
    const production = buildProduction({ targetRuntimeSeconds: 1_200 });
    const patched = capturePatch(production);

    renderInApp(
      <EditProductionForm
        projectId={PROJECT_ID}
        production={production}
        onClose={() => undefined}
      />,
    );

    const seconds = await screen.findByLabelText('Seconds');
    await user.clear(seconds);
    await user.type(seconds, '30');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(patched.body()).toBeDefined();
    });
    expect(patched.body()).toStrictEqual({ targetRuntimeSeconds: 1_230 });
  });

  it('says a set field cannot be emptied from here, and sends nothing for it', async () => {
    const user = userEvent.setup();
    const production = buildProduction({ logline: 'A pilot.' });

    renderInApp(
      <EditProductionForm
        projectId={PROJECT_ID}
        production={production}
        onClose={() => undefined}
      />,
    );

    await user.clear(await screen.findByLabelText('Logline'));

    expect(screen.getByText(/cannot be emptied from here/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });

  it('re-baselines on what the server returned, and announces the save', async () => {
    const user = userEvent.setup();
    const production = buildProduction();
    capturePatch(production, buildProduction({ title: 'Pilot, revised' }));

    renderInApp(
      <EditProductionForm
        projectId={PROJECT_ID}
        production={production}
        onClose={() => undefined}
      />,
    );

    await user.clear(await screen.findByLabelText('Title'));
    await user.type(screen.getByLabelText('Title'), 'Pilot, revised');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    const announcement = await screen.findByText('Saved.');

    expect(announcement.tagName).toBe('OUTPUT');
    expect(announcement).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });

  it('shows the refusal against the field that caused it', async () => {
    const user = userEvent.setup();
    const production = buildProduction();
    const patched = capturePatch(production);

    renderInApp(
      <EditProductionForm
        projectId={PROJECT_ID}
        production={production}
        onClose={() => undefined}
      />,
    );

    const minutes = await screen.findByLabelText('Minutes');
    await user.clear(minutes);
    await user.type(minutes, '-5');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(
      await screen.findByText(/Fields needing attention: 1/),
    ).toBeInTheDocument();
    expect(patched.body()).toBeUndefined();
  });
});
