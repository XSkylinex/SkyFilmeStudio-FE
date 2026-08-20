import { render, screen } from '@testing-library/react';
import { SystemPage } from '@/features/system/SystemPage';

describe('SystemPage', () => {
  it('renders the system empty state', () => {
    render(<SystemPage />);

    expect(
      screen.getByRole('heading', { name: 'System', level: 1 }),
    ).toBeInTheDocument();
  });
});
