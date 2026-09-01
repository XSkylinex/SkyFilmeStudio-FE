import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  projectIdSchema,
  styleProfileIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { EditStyleProfileForm } from '@/features/styles/components/edit-style-profile-form';
import { renderInApp } from '../../../../render-in-app';
import { buildStyleProfile } from '../../../../fixtures/style-profile.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const LINEAGE_ID = styleProfileIdSchema.parse(
  '11111111-1111-4111-8111-111111111111',
);

describe('EditStyleProfileForm', () => {
  it('disables saving until something actually changed, since a no-op patch is a 400', () => {
    const styleProfile = buildStyleProfile({
      id: LINEAGE_ID,
      lineageId: LINEAGE_ID,
    });

    renderInApp(
      <EditStyleProfileForm
        projectId={PROJECT_ID}
        lineageId={LINEAGE_ID}
        styleProfile={styleProfile}
        onClose={() => undefined}
      />,
    );

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });

  it('sends only the field that changed, never the fields the user never touched', async () => {
    const user = userEvent.setup();
    const styleProfile = buildStyleProfile({
      id: LINEAGE_ID,
      lineageId: LINEAGE_ID,
    });
    let patched: unknown;

    server.use(
      http.patch(
        API_PATH.styleProfile(PROJECT_ID, LINEAGE_ID),
        async ({ request }) => {
          patched = await request.json();

          return HttpResponse.json(
            buildStyleProfile({
              id: LINEAGE_ID,
              lineageId: LINEAGE_ID,
              description: 'New light.',
            }),
          );
        },
      ),
    );

    renderInApp(
      <EditStyleProfileForm
        projectId={PROJECT_ID}
        lineageId={LINEAGE_ID}
        styleProfile={styleProfile}
        onClose={() => undefined}
      />,
    );

    const description = screen.getByLabelText('Canonical description');

    await user.clear(description);
    await user.type(description, 'New light.');

    const saveButton = screen.getByRole('button', { name: 'Save changes' });

    expect(saveButton).toBeEnabled();
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Saved.')).toBeInTheDocument();
    });

    expect(patched).toEqual({ description: 'New light.' });
  });
  it('clears a realism level with null rather than omitting the key, because omitting means leave it alone', async () => {
    const user = userEvent.setup();
    const styleProfile = buildStyleProfile({
      id: LINEAGE_ID,
      lineageId: LINEAGE_ID,
      realismLevel: 'photoreal',
    });
    let patched: Record<string, unknown> = {};

    server.use(
      http.patch(
        API_PATH.styleProfile(PROJECT_ID, LINEAGE_ID),
        async ({ request }) => {
          patched = (await request.json()) as Record<string, unknown>;

          return HttpResponse.json(
            buildStyleProfile({ id: LINEAGE_ID, lineageId: LINEAGE_ID }),
          );
        },
      ),
    );

    renderInApp(
      <EditStyleProfileForm
        projectId={PROJECT_ID}
        lineageId={LINEAGE_ID}
        styleProfile={styleProfile}
        onClose={() => undefined}
      />,
    );

    await user.clear(screen.getByLabelText('Realism level'));
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(patched).toHaveProperty('realismLevel');
    });
    expect(patched['realismLevel']).toBeNull();
  });

  it('sends a changed rule list as lines, dropping the blank ones', async () => {
    const user = userEvent.setup();
    const styleProfile = buildStyleProfile({
      id: LINEAGE_ID,
      lineageId: LINEAGE_ID,
      paletteRules: ['deep blues'],
    });
    let patched: Record<string, unknown> = {};

    server.use(
      http.patch(
        API_PATH.styleProfile(PROJECT_ID, LINEAGE_ID),
        async ({ request }) => {
          patched = (await request.json()) as Record<string, unknown>;

          return HttpResponse.json(
            buildStyleProfile({ id: LINEAGE_ID, lineageId: LINEAGE_ID }),
          );
        },
      ),
    );

    renderInApp(
      <EditStyleProfileForm
        projectId={PROJECT_ID}
        lineageId={LINEAGE_ID}
        styleProfile={styleProfile}
        onClose={() => undefined}
      />,
    );

    const palette = screen.getByLabelText('Palette rules');
    await user.clear(palette);
    await user.type(palette, 'deep blues\n\ncold greys');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(patched).toHaveProperty('paletteRules');
    });
    expect(patched['paletteRules']).toEqual(['deep blues', 'cold greys']);
    expect(patched).not.toHaveProperty('name');
  });
});
