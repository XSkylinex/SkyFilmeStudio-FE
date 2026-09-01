import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import type { LocationId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { LocationCard } from '@/features/locations/components/location-card';
import { renderInApp } from '../../../../render-in-app';
import { buildLocation } from '../../../../fixtures/location.fixture';
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

const serveNoPlates = (locationId: LocationId): void => {
  server.use(
    http.get(API_PATH.locationPlates(PROJECT_ID, locationId), () =>
      HttpResponse.json({ items: [] }),
    ),
  );
};

describe('LocationCard', () => {
  it('offers Edit on a draft location, prefilled with its current values', async () => {
    const user = userEvent.setup();
    const location = buildLocation();
    serveNoPlates(location.id);

    renderInApp(<LocationCard projectId={PROJECT_ID} location={location} />);

    expect(
      screen.queryByText(/frozen and cannot be edited/),
    ).not.toBeInTheDocument();

    await user.click(await screen.findByRole('button', { name: /^Edit/ }));

    expect(
      await screen.findByRole('heading', { name: 'Edit this location' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('The lighthouse');
  });

  it('freezes an approved location instead of offering Edit', async () => {
    const location = buildLocation({ approved: true });
    serveNoPlates(location.id);

    renderInApp(<LocationCard projectId={PROJECT_ID} location={location} />);

    expect(
      await screen.findByText(/frozen and cannot be edited/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Edit/ }),
    ).not.toBeInTheDocument();
  });
});
