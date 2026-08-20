import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { SystemPage } from '@/features/system/SystemPage';

describe('SystemPage', () => {
  it('renders the system empty state', () => {
    renderInStore(<SystemPage />);

    expect(
      screen.getByRole('heading', { name: 'System', level: 1 }),
    ).toBeInTheDocument();
  });
});
