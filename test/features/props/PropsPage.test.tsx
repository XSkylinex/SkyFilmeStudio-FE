import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { PropsPage } from '@/features/props/PropsPage';

describe('PropsPage', () => {
  it('renders the props empty state', () => {
    renderInStore(<PropsPage />);

    expect(
      screen.getByRole('heading', { name: 'Props', level: 1 }),
    ).toBeInTheDocument();
  });
});
