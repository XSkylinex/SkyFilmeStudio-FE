import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { LocationList } from '@/features/locations/components/location-list';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

beforeAll(() => {
  if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    HTMLDialogElement.prototype.showModal = function (
      this: HTMLDialogElement,
    ): void {
      this.open = true;
    };
  }
  if (typeof HTMLDialogElement.prototype.close !== 'function') {
    HTMLDialogElement.prototype.close = function (
      this: HTMLDialogElement,
    ): void {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    };
  }
});

describe('LocationList', () => {
  it('offers Add even when the project has no locations yet', async () => {
    server.use(
      http.get(API_PATH.locations(PROJECT_ID), () =>
        HttpResponse.json({ items: [] }),
      ),
    );

    renderInApp(<LocationList projectId={PROJECT_ID} />);

    expect(await screen.findByText('No locations yet')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add a location' }),
    ).toBeInTheDocument();
  });

  it('opens the create dialog from the trigger button', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(API_PATH.locations(PROJECT_ID), () =>
        HttpResponse.json({ items: [] }),
      ),
    );

    renderInApp(<LocationList projectId={PROJECT_ID} />);

    await user.click(
      await screen.findByRole('button', { name: 'Add a location' }),
    );

    expect(
      await screen.findByRole('heading', { name: 'Add a location' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });
});
