import { render, screen } from '@testing-library/react';
import { App } from '@/App';

describe('App', () => {
  it('renders the project list at the root path', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Projects' }),
    ).toBeInTheDocument();
  });
});
