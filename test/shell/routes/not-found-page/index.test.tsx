import { render, screen } from '@testing-library/react';
import { NotFoundPage } from '@/shell/routes/not-found-page';

describe('NotFoundPage', () => {
  it('tells the user the address did not match a screen', () => {
    render(<NotFoundPage />);

    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument();
  });
});
