import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import type { Location } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { EditLocationForm } from '@/features/locations/components/edit-location-form';
import { renderInApp } from '../../../../render-in-app';
import { buildLocation } from '../../../../fixtures/location.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const renderForm = (location: Location, onClose: () => void): void => {
  renderInApp(
    <EditLocationForm
      projectId={PROJECT_ID}
      location={location}
      onClose={onClose}
    />,
  );
};

describe('EditLocationForm', () => {
  it('disables Save until something changes, then sends only the changed field', async () => {
    const user = userEvent.setup();
    const location = buildLocation();
    let patched: unknown;

    server.use(
      http.patch(
        API_PATH.location(PROJECT_ID, location.id),
        async ({ request }) => {
          patched = await request.json();

          return HttpResponse.json(
            buildLocation({
              layoutNotes: 'Spiral stair rises clockwise now.',
            }),
          );
        },
      ),
    );

    renderForm(location, () => undefined);

    const save = await screen.findByRole('button', { name: 'Save changes' });
    expect(save).toBeDisabled();

    const layoutNotesField = screen.getByLabelText('Layout notes');
    await user.type(layoutNotesField, 'Spiral stair rises clockwise now.');

    expect(save).toBeEnabled();
    await user.click(save);

    await waitFor(() => {
      expect(patched).toEqual({
        layoutNotes: 'Spiral stair rises clockwise now.',
      });
    });
    expect(await screen.findByText('Saved.')).toBeInTheDocument();
    expect(save).toBeDisabled();
  });

  it('refuses to submit an emptied name, and sends nothing', async () => {
    const user = userEvent.setup();
    const location = buildLocation();
    let patchCalls = 0;

    server.use(
      http.patch(API_PATH.location(PROJECT_ID, location.id), async () => {
        patchCalls += 1;

        return HttpResponse.json(location);
      }),
    );

    renderForm(location, () => undefined);

    const nameField = await screen.findByLabelText('Name');
    await user.clear(nameField);

    const save = screen.getByRole('button', { name: 'Save changes' });
    expect(save).toBeEnabled();
    await user.click(save);

    expect(await screen.findByText('This needs a value.')).toBeInTheDocument();
    expect(patchCalls).toBe(0);
  });
});
