import { render, screen } from '@testing-library/react';
import { SystemPanel } from '@/features/system/components/system-panel';

describe('SystemPanel', () => {
  it('gives its content a heading a screen reader can navigate to', () => {
    render(
      <SystemPanel title="Disk">
        <p>content</p>
      </SystemPanel>,
    );

    expect(
      screen.getByRole('heading', { name: 'Disk', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('takes the heading level from its caller, so a page can nest it without breaking the outline', () => {
    render(
      <SystemPanel title="Models" headingLevel={3}>
        <p>content</p>
      </SystemPanel>,
    );

    expect(
      screen.getByRole('heading', { name: 'Models', level: 3 }),
    ).toBeInTheDocument();
  });
});
