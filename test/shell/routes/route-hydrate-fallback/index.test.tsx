import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';
import { screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import { RouteHydrateFallback } from '@/shell/routes/route-hydrate-fallback';

describe('RouteHydrateFallback', () => {
  it('announces itself to assistive technology instead of going silent on a cold deep link', () => {
    renderInStore(<RouteHydrateFallback />);

    expect(
      screen.getByRole('status', {
        name: EN_CATALOGUE['shell.loadingPage'],
      }),
    ).toBeInTheDocument();
  });

  it('keeps the decorative skeleton pieces out of the accessible name', () => {
    const { container } = renderInStore(<RouteHydrateFallback />);

    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
