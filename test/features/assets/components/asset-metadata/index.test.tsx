import { screen } from '@testing-library/react';
import { AssetMetadata } from '@/features/assets/components/asset-metadata';
import { renderInApp } from '../../../../render-in-app';

describe('AssetMetadata', () => {
  it('says nothing was recorded rather than rendering an empty list', () => {
    renderInApp(<AssetMetadata metadata={{}} />);

    expect(
      screen.getByText('The orchestrator recorded no metadata for this asset.'),
    ).toBeInTheDocument();
    expect(document.querySelector('dl')).toBeNull();
  });

  it('renders what the orchestrator wrote without giving it a unit', () => {
    renderInApp(
      <AssetMetadata metadata={{ durationSeconds: 12.5, codec: 'h264' }} />,
    );

    expect(screen.getByText('durationSeconds')).toBeInTheDocument();
    expect(screen.getByText('12.5')).toBeInTheDocument();
    expect(screen.getByText('h264')).toBeInTheDocument();
  });

  it('says the shape is not published, so nothing here reads as interpreted', () => {
    renderInApp(<AssetMetadata metadata={{ codec: 'h264' }} />);

    expect(
      screen.getByText(/free-form object, so nothing here is interpreted/i),
    ).toBeInTheDocument();
  });

  it('isolates a value the orchestrator wrote, which may be in any language', () => {
    renderInApp(
      <AssetMetadata metadata={{ note: 'Diffuse, even lighting.' }} />,
    );

    const value = screen.getByText('Diffuse, even lighting.');

    expect(value.tagName).toBe('BDI');
    expect(value).toHaveAttribute('dir', 'auto');
  });

  it('keeps a machine-written key left-to-right on an inline element, not the block', () => {
    renderInApp(<AssetMetadata metadata={{ codec: 'h264' }} />);

    const key = screen.getByText('codec');

    expect(key.tagName).toBe('SPAN');
    expect(key).toHaveAttribute('dir', 'ltr');
    expect(key.closest('dt')).not.toHaveAttribute('dir');
  });
});
