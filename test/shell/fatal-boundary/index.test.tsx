import type { FC } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FatalBoundary } from '@/shell/fatal-boundary';

const Bomb: FC = () => {
  throw new Error('CUDA_OUT_OF_MEMORY');
};

describe('FatalBoundary', () => {
  it('renders its children when nothing has thrown', () => {
    render(
      <FatalBoundary>
        <p>Local AI Studio</p>
      </FatalBoundary>,
    );

    expect(screen.getByText('Local AI Studio')).toBeInTheDocument();
  });

  it('catches a render error from a descendant and shows the raw message, with a reload action', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const reloadSpy = vi.fn<() => void>();
    vi.stubGlobal('location', { reload: reloadSpy });
    const user = userEvent.setup();

    render(
      <FatalBoundary>
        <Bomb />
      </FatalBoundary>,
    );

    expect(
      screen.getByText('Local AI Studio hit an unrecoverable error'),
    ).toBeInTheDocument();
    expect(screen.getByText('CUDA_OUT_OF_MEMORY')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reload' }));

    expect(reloadSpy).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
