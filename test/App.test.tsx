import { render, screen } from '@testing-library/react';
import { App } from '@/App';

describe('App', () => {
  it('renders the design system preview', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Design system preview' }),
    ).toBeInTheDocument();
  });
});
