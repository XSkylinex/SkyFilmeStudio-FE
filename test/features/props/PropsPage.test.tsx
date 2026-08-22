import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  projectIdSchema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { Prop } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { PropsPage } from '@/features/props/PropsPage';
import { renderInApp } from '../../render-in-app';
import { buildProp } from '../../fixtures/prop.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const renderPage = (): void => {
  renderInApp(
    <MemoryRouter initialEntries={[`/projects/${PROJECT_ID}/props`]}>
      <Routes>
        <Route path="/projects/:projectId/props" element={<PropsPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

const orchestratorServes = (
  items: readonly Prop[],
  nextCursor?: string,
): void => {
  server.use(
    http.get(API_PATH.projectProps(PROJECT_ID), () =>
      HttpResponse.json(
        nextCursor === undefined ? { items } : { items, nextCursor },
      ),
    ),
  );
};

describe('PropsPage', () => {
  it('shows each prop with the continuity rules it carries', async () => {
    orchestratorServes([buildProp()]);

    renderPage();

    expect(
      await screen.findByRole('heading', { name: 'Brass compass', level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('the glass stays cracked after scene 4'),
    ).toBeInTheDocument();
  });

  it('says plainly when a prop will not be checked between scenes', async () => {
    orchestratorServes([buildProp({ continuityRules: [] })]);

    renderPage();

    expect(
      await screen.findByText(/nothing about this prop will be checked/),
    ).toBeInTheDocument();
  });

  it('offers approval on a draft and none on an approved prop', async () => {
    orchestratorServes([buildProp()]);

    renderPage();

    expect(
      await screen.findByRole('button', {
        name: 'Approve the prop Brass compass',
      }),
    ).toBeInTheDocument();
  });

  it('renders no approve control once the server says it is approved', async () => {
    orchestratorServes([buildProp({ approved: true })]);

    renderPage();

    expect(await screen.findByText('Approved')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Approve/ }),
    ).not.toBeInTheDocument();
  });

  it('marks a prop that belongs to a subject without naming the subject', async () => {
    orchestratorServes([
      buildProp({
        ownerSubjectId: subjectIdSchema.parse(
          '66666666-6666-4666-8666-666666666666',
        ),
      }),
    ]);

    renderPage();

    expect(await screen.findByText('Belongs to a subject')).toBeInTheDocument();
  });

  it('does not claim to know where a prop appears', async () => {
    orchestratorServes([buildProp()]);

    renderPage();

    expect(
      await screen.findByText(/nothing published joins a prop to its scenes/),
    ).toBeInTheDocument();
  });
});
