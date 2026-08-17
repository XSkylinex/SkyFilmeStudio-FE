import { render, screen } from '@testing-library/react';
import { PropsPage } from '@/features/props/PropsPage';

describe('PropsPage', () => {
  it('renders the props empty state', () => {
    render(<PropsPage />);

    expect(screen.getByRole('heading', { name: 'Props' })).toBeInTheDocument();
  });
});
