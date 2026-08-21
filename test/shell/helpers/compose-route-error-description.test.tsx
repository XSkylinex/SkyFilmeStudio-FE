import { render, screen } from '@testing-library/react';
import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';
import { translate } from '@/lib/i18n/helpers/translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import type { RouteErrorView } from '@/shell/interfaces/route-error-view';

const BACKEND_MESSAGE = 'Only 2 GB free on the project volume.';

const describeInEnglish = (view: RouteErrorView): HTMLElement => {
  const { container } = render(
    <>
      {composeRouteErrorDescription(view, (key, values) =>
        translate(EN_CATALOGUE, key, values),
      )}
    </>,
  );

  return container;
};

describe('composeRouteErrorDescription', () => {
  it('isolates the orchestrator message, which it did not write and does not translate', () => {
    describeInEnglish({
      descriptionKey: 'error.DISK_SPACE_LOW',
      descriptionDetail: BACKEND_MESSAGE,
      isUnknownError: false,
    });

    const isolated = screen.getByText(BACKEND_MESSAGE);

    expect(isolated.tagName).toBe('BDI');
    expect(isolated).toHaveAttribute('dir', 'auto');
  });

  it('keeps our own translated sentence outside the isolation', () => {
    const container = describeInEnglish({
      descriptionKey: 'error.DISK_SPACE_LOW',
      descriptionDetail: BACKEND_MESSAGE,
      isUnknownError: false,
    });

    expect(container.textContent).toBe(
      `${EN_CATALOGUE['error.DISK_SPACE_LOW']} (${BACKEND_MESSAGE})`,
    );
  });

  it('renders the sentence alone when the orchestrator sent no message', () => {
    const container = describeInEnglish({
      descriptionKey: 'error.DISK_SPACE_LOW',
      isUnknownError: false,
    });

    expect(container.textContent).toBe(EN_CATALOGUE['error.DISK_SPACE_LOW']);
    expect(container.querySelector('bdi')).toBeNull();
  });

  it('still isolates a message that arrives with no sentence of ours to carry it', () => {
    describeInEnglish({
      descriptionDetail: BACKEND_MESSAGE,
      isUnknownError: false,
    });

    expect(screen.getByText(BACKEND_MESSAGE).tagName).toBe('BDI');
  });
});
