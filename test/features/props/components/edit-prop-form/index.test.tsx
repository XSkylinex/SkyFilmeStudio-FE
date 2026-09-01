import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import type { Prop } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { EditPropForm } from '@/features/props/components/edit-prop-form';
import { renderInApp } from '../../../../render-in-app';
import { buildProp } from '../../../../fixtures/prop.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const renderForm = (prop: Prop, onClose: () => void): void => {
  renderInApp(
    <EditPropForm projectId={PROJECT_ID} prop={prop} onClose={onClose} />,
  );
};

describe('EditPropForm', () => {
  it('disables Save until something changes, then sends only the changed field', async () => {
    const user = userEvent.setup();
    const prop = buildProp();
    let patched: unknown;

    server.use(
      http.patch(
        API_PATH.projectProp(PROJECT_ID, prop.id),
        async ({ request }) => {
          patched = await request.json();

          return HttpResponse.json(
            buildProp({
              canonicalDescription:
                'A dented brass compass, glass now missing.',
            }),
          );
        },
      ),
    );

    renderForm(prop, () => undefined);

    const save = await screen.findByRole('button', { name: 'Save changes' });
    expect(save).toBeDisabled();

    const descriptionField = screen.getByLabelText('Canonical description');
    await user.clear(descriptionField);
    await user.type(
      descriptionField,
      'A dented brass compass, glass now missing.',
    );

    expect(save).toBeEnabled();
    await user.click(save);

    await waitFor(() => {
      expect(patched).toEqual({
        canonicalDescription: 'A dented brass compass, glass now missing.',
      });
    });
    expect(await screen.findByText('Saved.')).toBeInTheDocument();
    expect(save).toBeDisabled();
  });

  it('refuses to submit an emptied name, and sends nothing', async () => {
    const user = userEvent.setup();
    const prop = buildProp();
    let patchCalls = 0;

    server.use(
      http.patch(API_PATH.projectProp(PROJECT_ID, prop.id), async () => {
        patchCalls += 1;

        return HttpResponse.json(prop);
      }),
    );

    renderForm(prop, () => undefined);

    const nameField = await screen.findByLabelText('Name');
    await user.clear(nameField);

    const save = screen.getByRole('button', { name: 'Save changes' });
    expect(save).toBeEnabled();
    await user.click(save);

    expect(await screen.findByText('This needs a value.')).toBeInTheDocument();
    expect(patchCalls).toBe(0);
  });
});
