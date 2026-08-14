import { render, screen } from '@testing-library/react';
import { App } from '@/App';

describe('App', () => {
  it('names the application in the top-level heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Local AI Studio',
    );
  });
});
