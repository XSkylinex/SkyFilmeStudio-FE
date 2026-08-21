import { screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import userEvent from '@testing-library/user-event';
import { Toast } from '@/lib/components/toast';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '@/shell/store';
import { interfaceLanguageSet } from '@/shell/shell.slice';

describe('Toast', () => {
  it('announces politely by default, via role="status"', () => {
    renderInStore(<Toast tone={STATUS_TONE.SUCCESS} title="Shot approved" />);

    expect(screen.getByRole('status')).toHaveTextContent('Shot approved');
  });

  it('announces assertively for a danger tone, via role="alert"', () => {
    renderInStore(<Toast tone={STATUS_TONE.DANGER} title="Render failed" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Render failed');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders the description only when given', () => {
    const { container, rerender } = renderInStore(
      <Toast tone={STATUS_TONE.NEUTRAL} title="Queued" />,
    );
    expect(
      container.querySelector('.toast__description'),
    ).not.toBeInTheDocument();

    rerender(
      <Toast
        tone={STATUS_TONE.NEUTRAL}
        title="Queued"
        description="Waiting for a free GPU slot"
      />,
    );
    expect(screen.getByText('Waiting for a free GPU slot')).toBeInTheDocument();
  });

  it('renders no dismiss control when onDismiss is not given', () => {
    renderInStore(<Toast tone={STATUS_TONE.NEUTRAL} title="Queued" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('reuses IconButton for dismiss and calls onDismiss when clicked', async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn<() => void>();
    renderInStore(
      <Toast
        tone={STATUS_TONE.NEUTRAL}
        title="Queued"
        onDismiss={handleDismiss}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
  it('translates the dismiss label, which is the only name that button has', () => {
    const store = createStore();
    store.dispatch(interfaceLanguageSet('he'));

    render(
      <Provider store={store}>
        <Toast
          tone={STATUS_TONE.SUCCESS}
          title="Shot approved"
          onDismiss={() => {}}
        />
      </Provider>,
    );

    expect(screen.getByRole('button', { name: 'סגור' })).toBeInTheDocument();
  });
});
