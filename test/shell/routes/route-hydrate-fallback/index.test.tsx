import { render } from '@testing-library/react';
import { RouteHydrateFallback } from '@/shell/routes/route-hydrate-fallback';

describe('RouteHydrateFallback', () => {
  it('renders as decoration only, hidden from assistive technology', () => {
    const { container } = render(<RouteHydrateFallback />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
