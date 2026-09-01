import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { PropList } from '@/features/props/components/prop-list';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

describe('PropList', () => {
  it('offers Add even when the project has no props yet', async () => {
    server.use(
      http.get(API_PATH.projectProps(PROJECT_ID), () =>
        HttpResponse.json({ items: [] }),
      ),
    );

    renderInApp(<PropList projectId={PROJECT_ID} />);

    expect(await screen.findByText('No props yet')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add a prop' }),
    ).toBeInTheDocument();
  });

  it('opens the create dialog from the trigger button', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(API_PATH.projectProps(PROJECT_ID), () =>
        HttpResponse.json({ items: [] }),
      ),
    );

    renderInApp(<PropList projectId={PROJECT_ID} />);

    await user.click(await screen.findByRole('button', { name: 'Add a prop' }));

    expect(
      await screen.findByRole('heading', { name: 'Add a prop' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });
});
