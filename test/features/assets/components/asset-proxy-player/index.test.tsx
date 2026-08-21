import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { AssetProxyPlayer } from '@/features/assets/components/asset-proxy-player';
import { renderInApp } from '../../../../render-in-app';
import { buildSourceAsset } from '../../../../fixtures/source-asset.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const VIDEO = buildSourceAsset({ type: 'VIDEO' });

const orchestratorAnswers = (status: number): number => {
  let asked = 0;
  server.use(
    http.head(API_PATH.projectAssetProxy(PROJECT_ID, VIDEO.id), () => {
      asked += 1;
      return new HttpResponse(null, { status });
    }),
  );
  return asked;
};

const renderPlayer = (asset = VIDEO): void => {
  renderInApp(<AssetProxyPlayer projectId={PROJECT_ID} asset={asset} />);
};

const video = async (): Promise<HTMLVideoElement> => {
  await screen.findByLabelText(/scrub proxy of/i);
  const element = document.querySelector('video');
  if (!element) {
    throw new Error('no video element rendered');
  }
  return element;
};

describe('AssetProxyPlayer', () => {
  it('plays the orchestrator proxy, never the original file', async () => {
    orchestratorAnswers(200);
    renderPlayer();

    const source = (await video()).getAttribute('src') ?? '';

    expect(source).toContain('/proxy');
    expect(source).not.toContain('/original/');
  });

  it('never autoplays, and offers controls instead', async () => {
    orchestratorAnswers(200);
    renderPlayer();

    const element = await video();

    expect(element).not.toHaveAttribute('autoplay');
    expect(element).toHaveAttribute('controls');
  });

  it('carries an accessible name naming the file it shows', async () => {
    orchestratorAnswers(200);
    renderPlayer();

    expect((await video()).getAttribute('aria-label')).toContain(VIDEO.path);
  });

  it('asks the orchestrator rather than waiting for the element to fail', async () => {
    orchestratorAnswers(404);
    renderPlayer();

    expect(
      await screen.findByRole('heading', { name: 'No proxy yet' }),
    ).toBeInTheDocument();
    expect(document.querySelector('video')).toBeNull();
  });

  it('treats an absent proxy as a normal state, not an error', async () => {
    orchestratorAnswers(404);
    renderPlayer();

    await screen.findByRole('heading', { name: 'No proxy yet' });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: 'Could not tell whether a proxy exists',
      }),
    ).not.toBeInTheDocument();
  });

  it('can ask again, because the proxy job may finish while the page is open', async () => {
    orchestratorAnswers(404);
    const user = userEvent.setup();
    renderPlayer();

    await screen.findByRole('heading', { name: 'No proxy yet' });
    orchestratorAnswers(200);
    await user.click(screen.getByRole('button', { name: 'Ask again' }));

    expect(await video()).toBeInTheDocument();
  });

  it('says plainly when it could not find out, rather than implying no proxy', async () => {
    orchestratorAnswers(500);
    renderPlayer();

    expect(
      await screen.findByRole('heading', {
        name: 'Could not tell whether a proxy exists',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'No proxy yet' }),
    ).not.toBeInTheDocument();
  });

  it('asks nothing at all for an asset the orchestrator makes no proxy for', async () => {
    let asked = false;
    server.use(
      http.head(API_PATH.projectAssetProxy(PROJECT_ID, VIDEO.id), () => {
        asked = true;
        return new HttpResponse(null, { status: 200 });
      }),
    );

    renderPlayer(buildSourceAsset({ type: 'IMAGE' }));

    expect(
      await screen.findByText(/generates a scrub proxy for video only/i),
    ).toBeInTheDocument();
    expect(document.querySelector('video')).toBeNull();
    expect(asked).toBe(false);
  });
});
