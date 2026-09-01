import { http, HttpResponse } from 'msw';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createPropRequestSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { CreatePropForm } from '@/features/props/components/create-prop-form';
import { renderInApp } from '../../../../render-in-app';
import { buildProp } from '../../../../fixtures/prop.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const renderForm = (onClose: () => void): void => {
  renderInApp(<CreatePropForm projectId={PROJECT_ID} onClose={onClose} />);
};

describe('CreatePropForm', () => {
  it('parses what was typed and sends exactly the request the contract expects', async () => {
    const user = userEvent.setup();
    let created: unknown;

    server.use(
      http.post(API_PATH.projectProps(PROJECT_ID), async ({ request }) => {
        created = await request.json();

        return HttpResponse.json(buildProp({ name: 'Brass compass' }));
      }),
    );

    renderForm(() => undefined);

    await user.type(screen.getByLabelText('Name'), 'Brass compass');
    await user.type(
      screen.getByLabelText('Canonical description'),
      'A dented brass compass with a cracked glass face.',
    );
    fireEvent.change(screen.getByLabelText('Continuity rules'), {
      target: { value: 'the glass stays cracked after scene 4' },
    });
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(created).toEqual(
        createPropRequestSchema.parse({
          name: 'Brass compass',
          canonicalDescription:
            'A dented brass compass with a cracked glass face.',
          continuityRules: ['the glass stays cracked after scene 4'],
        }),
      );
    });
    expect(await screen.findByText('Created.')).toBeInTheDocument();
  });

  it('refuses to submit an empty name, and sends nothing', async () => {
    const user = userEvent.setup();
    let postCalls = 0;

    server.use(
      http.post(API_PATH.projectProps(PROJECT_ID), async () => {
        postCalls += 1;

        return HttpResponse.json(buildProp());
      }),
    );

    renderForm(() => undefined);

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('This needs a value.')).toBeInTheDocument();
    expect(postCalls).toBe(0);
  });
});
