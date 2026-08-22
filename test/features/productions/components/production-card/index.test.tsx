import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  productionProfileIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { Production } from 'sky-filme-studio-be/contracts';
import { ProductionCard } from '@/features/productions/components/production-card';
import { renderInStore } from '../../../../render-in-store';
import { buildProduction } from '../../../../fixtures/production.fixture';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const renderCard = (production: Production): void => {
  renderInStore(
    <MemoryRouter>
      <ul>
        <ProductionCard projectId={PROJECT_ID} production={production} />
      </ul>
    </MemoryRouter>,
  );
};

describe('ProductionCard', () => {
  it('shows a formatted tolerance when the production declares one', () => {
    renderCard(buildProduction({ runtimeToleranceSeconds: 30 }));

    expect(screen.getByText('0:30')).toBeInTheDocument();
    expect(
      screen.queryByText(/orchestrator refuses to judge/),
    ).not.toBeInTheDocument();
  });

  it('credits the structure profile when the production itself declares none', () => {
    renderCard(
      buildProduction({
        runtimeToleranceSeconds: undefined,
        productionProfileId: productionProfileIdSchema.parse(
          '44444444-4444-4444-8444-444444444444',
        ),
      }),
    );

    expect(
      screen.getByText('Declared by its structure profile'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/orchestrator refuses to judge/),
    ).not.toBeInTheDocument();
  });

  it('says a tolerance is undeclared, and why that blocks approval, when neither exists', () => {
    renderCard(
      buildProduction({
        runtimeToleranceSeconds: undefined,
        productionProfileId: undefined,
      }),
    );

    expect(screen.getByText('None declared')).toBeInTheDocument();
    expect(
      screen.getByText(/orchestrator refuses to judge/),
    ).toBeInTheDocument();
  });

  it('names the production in the link rather than a generic "open"', () => {
    renderCard(buildProduction({ title: 'Pilot' }));

    expect(
      screen.getByRole('link', { name: 'Open the plan for Pilot' }),
    ).toBeInTheDocument();
  });

  it('says no screenplay version yet rather than showing a blank', () => {
    renderCard(buildProduction({ screenplayVersion: undefined }));

    expect(screen.getByText('No screenplay version yet')).toBeInTheDocument();
  });

  it('shows a sequence number only when the production has one', () => {
    renderCard(buildProduction({ sequenceNumber: 3 }));

    expect(screen.getByText('Number in sequence:')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('says nothing about a sequence number the production does not have', () => {
    renderCard(buildProduction({ sequenceNumber: undefined }));

    expect(screen.queryByText('Number in sequence:')).not.toBeInTheDocument();
  });

  it('isolates a Hebrew title with dir="auto" rather than a language it does not carry', () => {
    renderCard(buildProduction({ title: 'מסע הלילה' }));

    const title = screen.getByText('מסע הלילה');

    expect(title.tagName).toBe('BDI');
    expect(title).toHaveAttribute('dir', 'auto');
  });
});
