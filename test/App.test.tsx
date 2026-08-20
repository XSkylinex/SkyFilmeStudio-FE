import { screen } from '@testing-library/react';
import { renderInStore } from './render-in-store';
import { App } from '@/App';

describe('App', () => {
  it('renders the project list at the root path', () => {
    renderInStore(<App />);

    expect(
      screen.getByRole('heading', { name: 'Projects' }),
    ).toBeInTheDocument();
  });
});
