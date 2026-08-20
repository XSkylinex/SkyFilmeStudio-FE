import { screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import { NotFoundPage } from '@/shell/routes/not-found-page';

describe('NotFoundPage', () => {
  it('tells the user the address did not match a screen', () => {
    renderInStore(<NotFoundPage />);

    expect(
      screen.getByRole('heading', { name: 'Page not found', level: 1 }),
    ).toBeInTheDocument();
  });
});
