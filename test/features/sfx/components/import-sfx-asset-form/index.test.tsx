import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API_PATH } from '@/lib/api/api.constants';
import { ImportSfxAssetForm } from '@/features/sfx/components/import-sfx-asset-form';
import { buildSfxAsset } from '../../../../fixtures/sfx-asset.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer(
  http.get(API_PATH.sfxAssets(), () => HttpResponse.json({ items: [] })),
);

const capturePost = (): { body: () => unknown } => {
  let captured: unknown;
  server.use(
    http.post(API_PATH.sfxAssets(), async ({ request }) => {
      captured = await request.json();
      return HttpResponse.json(buildSfxAsset());
    }),
  );

  return { body: () => captured };
};

const fill = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(
    screen.getByLabelText('Path to the file'),
    '/sounds/gravel.wav',
  );
  await user.type(screen.getByLabelText('Name'), 'Boots on gravel');
  await user.type(screen.getByLabelText('Category'), 'FOOTSTEPS');
};

describe('ImportSfxAssetForm', () => {
  it('sends the path, name, category and licence that were typed', async () => {
    const user = userEvent.setup();
    const posted = capturePost();

    renderInApp(<ImportSfxAssetForm onClose={() => undefined} />);

    await fill(user);
    await user.type(screen.getByLabelText('Licence'), 'CC0');
    await user.click(screen.getByRole('button', { name: 'Import' }));

    await waitFor(() => {
      expect(posted.body()).toBeDefined();
    });
    expect(posted.body()).toStrictEqual({
      sourcePath: '/sounds/gravel.wav',
      name: 'Boots on gravel',
      category: 'FOOTSTEPS',
      origin: 'IMPORTED',
      licence: 'CC0',
    });
  });

  it('refuses an imported sound with no licence, because the library records what may be shipped', async () => {
    const user = userEvent.setup();
    const posted = capturePost();

    renderInApp(<ImportSfxAssetForm onClose={() => undefined} />);

    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Import' }));

    expect(
      await screen.findByText(/Fields needing attention/),
    ).toBeInTheDocument();
    expect(posted.body()).toBeUndefined();
  });

  it('takes a sound this installation generated with no licence at all', async () => {
    const user = userEvent.setup();
    const posted = capturePost();

    renderInApp(<ImportSfxAssetForm onClose={() => undefined} />);

    await fill(user);
    await user.selectOptions(
      screen.getByLabelText('Origin'),
      'LOCALLY_GENERATED',
    );
    await user.click(screen.getByRole('button', { name: 'Import' }));

    await waitFor(() => {
      expect(posted.body()).toBeDefined();
    });
    expect(posted.body()).toStrictEqual({
      sourcePath: '/sounds/gravel.wav',
      name: 'Boots on gravel',
      category: 'FOOTSTEPS',
      origin: 'LOCALLY_GENERATED',
    });
  });

  it('splits tags on newlines and omits an empty list rather than sending one', async () => {
    const user = userEvent.setup();
    const posted = capturePost();

    renderInApp(<ImportSfxAssetForm onClose={() => undefined} />);

    await fill(user);
    await user.type(screen.getByLabelText('Licence'), 'CC0');
    await user.type(screen.getByLabelText('Tags'), 'exterior\nwalking');
    await user.click(screen.getByRole('button', { name: 'Import' }));

    await waitFor(() => {
      expect(posted.body()).toBeDefined();
    });
    expect(posted.body()).toMatchObject({ tags: ['exterior', 'walking'] });
  });

  it('refuses a category the contract does not accept, on that field', async () => {
    const user = userEvent.setup();
    const posted = capturePost();

    renderInApp(<ImportSfxAssetForm onClose={() => undefined} />);

    await user.type(
      screen.getByLabelText('Path to the file'),
      '/sounds/gravel.wav',
    );
    await user.type(screen.getByLabelText('Name'), 'Boots on gravel');
    await user.type(screen.getByLabelText('Category'), 'lower case');
    await user.type(screen.getByLabelText('Licence'), 'CC0');
    await user.click(screen.getByRole('button', { name: 'Import' }));

    expect(
      await screen.findByText('The contract will not accept this value.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInvalid();
    expect(posted.body()).toBeUndefined();
  });

  it('announces the imported sound and puts focus on the announcement', async () => {
    const user = userEvent.setup();
    capturePost();

    renderInApp(<ImportSfxAssetForm onClose={() => undefined} />);

    await fill(user);
    await user.type(screen.getByLabelText('Licence'), 'CC0');
    await user.click(screen.getByRole('button', { name: 'Import' }));

    const announcement = await screen.findByText('Created.');

    expect(announcement.tagName).toBe('OUTPUT');
    expect(announcement).toHaveFocus();
  });

  it('shows the refusal of a sound the library already holds', async () => {
    const user = userEvent.setup();
    server.use(
      http.post(API_PATH.sfxAssets(), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'SFX_ASSET_EXISTS',
            message: 'already held',
          },
          { status: 409 },
        ),
      ),
    );

    renderInApp(<ImportSfxAssetForm onClose={() => undefined} />);

    await fill(user);
    await user.type(screen.getByLabelText('Licence'), 'CC0');
    await user.click(screen.getByRole('button', { name: 'Import' }));

    expect(
      await screen.findByText('The sound was not imported'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/matched by its content rather than its name/),
    ).toBeInTheDocument();
  });
});
