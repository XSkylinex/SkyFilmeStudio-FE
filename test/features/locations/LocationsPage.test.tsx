import { http, HttpResponse } from 'msw';
import { screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  locationIdSchema,
  locationPlateIdSchema,
  plateKindSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { Location, LocationPlate } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { LocationsPage } from '@/features/locations/LocationsPage';
import { renderInApp } from '../../render-in-app';
import {
  buildLocation,
  buildLocationPlate,
} from '../../fixtures/location.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const LOCATION_ID = locationIdSchema.parse(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
);

const server = mockOrchestratorServer(
  http.get(API_PATH.projectAssets(PROJECT_ID), () =>
    HttpResponse.json({ items: [] }),
  ),
);

const renderPage = (): void => {
  renderInApp(
    <MemoryRouter initialEntries={[`/projects/${PROJECT_ID}/locations`]}>
      <Routes>
        <Route
          path="/projects/:projectId/locations"
          element={<LocationsPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

const orchestratorServes = (
  locations: readonly Location[],
  plates: readonly LocationPlate[],
): void => {
  server.use(
    http.get(API_PATH.locations(PROJECT_ID), () =>
      HttpResponse.json({ items: locations }),
    ),
    http.get(API_PATH.locationPlates(PROJECT_ID, LOCATION_ID), () =>
      HttpResponse.json({ items: plates }),
    ),
  );
};

const coverageStrip = (): HTMLElement => {
  const strip = screen.getByText('Plate coverage').closest('div');

  if (strip === null) {
    throw new Error('the plate coverage strip is not on screen');
  }

  return strip;
};

describe('LocationsPage', () => {
  it('lists a location with the immutable features a scene must keep', async () => {
    orchestratorServes([buildLocation()], []);

    renderPage();

    expect(
      await screen.findByRole('heading', { name: 'The lighthouse', level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/spiral stair/)).toBeInTheDocument();
  });

  it('says a location with no plates resolves from text', async () => {
    orchestratorServes([buildLocation()], []);

    renderPage();

    expect(
      await screen.findByText(
        /resolves from text rather than from a canonical image/,
      ),
    ).toBeInTheDocument();
  });

  it('separates a covered kind from one that has only drafts', async () => {
    orchestratorServes(
      [buildLocation()],
      [
        buildLocationPlate({
          kind: plateKindSchema.parse('WIDE_ESTABLISHING'),
          approved: true,
        }),
        buildLocationPlate({
          id: locationPlateIdSchema.parse(
            '11111111-1111-4111-8111-111111111111',
          ),
          kind: plateKindSchema.parse('MEDIUM_LEFT'),
        }),
      ],
    );

    renderPage();

    await screen.findAllByText('WIDE_ESTABLISHING');
    expect(
      within(coverageStrip()).getByText('WIDE_ESTABLISHING'),
    ).toBeInTheDocument();
    expect(
      within(coverageStrip()).getByText('MEDIUM_LEFT'),
    ).toBeInTheDocument();
    expect(
      within(coverageStrip()).getByText('None approved — drafts: 1'),
    ).toBeInTheDocument();
  });

  it('shows a kind the orchestrator invented, not only the suggested four', async () => {
    orchestratorServes(
      [buildLocation()],
      [
        buildLocationPlate({
          kind: plateKindSchema.parse('UNDER_THE_STAIR'),
          approved: true,
        }),
      ],
    );

    renderPage();

    await screen.findAllByText('UNDER_THE_STAIR');
    expect(
      within(coverageStrip()).getByText('UNDER_THE_STAIR'),
    ).toBeInTheDocument();
  });

  it('frames uncovered suggested kinds as suggestions, never as requirements', async () => {
    orchestratorServes([buildLocation()], []);

    renderPage();

    expect(
      await screen.findByText(/suggestions, not requirements/),
    ).toBeInTheDocument();
  });

  it('shows a lighting-variant kind as observed, never as a checklist slot', async () => {
    orchestratorServes(
      [buildLocation()],
      [
        buildLocationPlate({
          kind: plateKindSchema.parse('NIGHT'),
          approved: true,
        }),
      ],
    );

    renderPage();

    await screen.findAllByText('NIGHT');
    expect(within(coverageStrip()).getByText('NIGHT')).toBeInTheDocument();
    expect(
      screen.getByText(/suggestions, not requirements/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/NIGHT.*missing|missing.*NIGHT/),
    ).not.toBeInTheDocument();
  });
});
