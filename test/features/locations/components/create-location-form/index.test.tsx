import { http, HttpResponse } from 'msw';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createLocationRequestSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { CreateLocationForm } from '@/features/locations/components/create-location-form';
import { renderInApp } from '../../../../render-in-app';
import { buildLocation } from '../../../../fixtures/location.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const renderForm = (onClose: () => void): void => {
  renderInApp(<CreateLocationForm projectId={PROJECT_ID} onClose={onClose} />);
};

describe('CreateLocationForm', () => {
  it('parses what was typed and sends exactly the request the contract expects', async () => {
    const user = userEvent.setup();
    let created: unknown;

    server.use(
      http.post(API_PATH.locations(PROJECT_ID), async ({ request }) => {
        created = await request.json();

        return HttpResponse.json(buildLocation({ name: 'The lighthouse' }));
      }),
    );

    renderForm(() => undefined);

    await user.type(screen.getByLabelText('Name'), 'The lighthouse');
    await user.type(
      screen.getByLabelText('Canonical description'),
      'A stone lighthouse on a basalt shelf.',
    );
    await user.type(
      screen.getByLabelText('Layout notes'),
      'Spiral stair rises anticlockwise.',
    );
    fireEvent.change(screen.getByLabelText('Immutable features'), {
      target: { value: 'spiral stair\ncracked lantern glass' },
    });
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(created).toEqual(
        createLocationRequestSchema.parse({
          name: 'The lighthouse',
          canonicalDescription: 'A stone lighthouse on a basalt shelf.',
          layoutNotes: 'Spiral stair rises anticlockwise.',
          immutableFeatures: ['spiral stair', 'cracked lantern glass'],
        }),
      );
    });
    expect(await screen.findByText('Created.')).toBeInTheDocument();
  });

  it('refuses to submit an empty name, and sends nothing', async () => {
    const user = userEvent.setup();
    let postCalls = 0;

    server.use(
      http.post(API_PATH.locations(PROJECT_ID), async () => {
        postCalls += 1;

        return HttpResponse.json(buildLocation());
      }),
    );

    renderForm(() => undefined);

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('This needs a value.')).toBeInTheDocument();
    expect(postCalls).toBe(0);
  });
});
