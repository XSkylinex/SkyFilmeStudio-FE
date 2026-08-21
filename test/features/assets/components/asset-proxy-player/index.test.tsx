import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { AssetProxyPlayer } from '@/features/assets/components/asset-proxy-player';
import { renderInApp } from '../../../../render-in-app';
import { buildSourceAsset } from '../../../../fixtures/source-asset.fixture';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const video = (): HTMLVideoElement => {
  const element = document.querySelector('video');
  if (!element) {
    throw new Error('no video element rendered');
  }
  return element;
};

describe('AssetProxyPlayer', () => {
  it('plays the orchestrator proxy, never the original file', () => {
    renderInApp(
      <AssetProxyPlayer
        projectId={PROJECT_ID}
        asset={buildSourceAsset({ type: 'VIDEO' })}
      />,
    );

    const source = video().getAttribute('src') ?? '';

    expect(source).toContain('/proxy');
    expect(source).not.toContain('/original/');
  });

  it('never autoplays, and offers controls instead', () => {
    renderInApp(
      <AssetProxyPlayer
        projectId={PROJECT_ID}
        asset={buildSourceAsset({ type: 'VIDEO' })}
      />,
    );

    expect(video()).not.toHaveAttribute('autoplay');
    expect(video()).toHaveAttribute('controls');
  });

  it('carries an accessible name naming the file it shows', () => {
    const asset = buildSourceAsset({ type: 'VIDEO' });

    renderInApp(<AssetProxyPlayer projectId={PROJECT_ID} asset={asset} />);

    expect(video().getAttribute('aria-label')).toContain(asset.path);
  });

  it('offers nothing to play for an asset the orchestrator makes no proxy for', () => {
    renderInApp(
      <AssetProxyPlayer
        projectId={PROJECT_ID}
        asset={buildSourceAsset({ type: 'IMAGE' })}
      />,
    );

    expect(document.querySelector('video')).toBeNull();
    expect(
      screen.getByText(/generates a scrub proxy for video only/i),
    ).toBeInTheDocument();
  });

  it('treats a proxy that has not been generated as a normal state, not an error', () => {
    renderInApp(
      <AssetProxyPlayer
        projectId={PROJECT_ID}
        asset={buildSourceAsset({ type: 'VIDEO' })}
      />,
    );

    fireEvent.error(video());

    expect(
      screen.getByRole('heading', { name: 'No proxy yet' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('can look again, because the proxy job may finish while the page is open', async () => {
    const user = userEvent.setup();

    renderInApp(
      <AssetProxyPlayer
        projectId={PROJECT_ID}
        asset={buildSourceAsset({ type: 'VIDEO' })}
      />,
    );

    fireEvent.error(video());
    await user.click(
      screen.getByRole('button', { name: 'Look for the proxy again' }),
    );

    expect(document.querySelector('video')).not.toBeNull();
    expect(
      screen.queryByRole('heading', { name: 'No proxy yet' }),
    ).not.toBeInTheDocument();
  });
});
