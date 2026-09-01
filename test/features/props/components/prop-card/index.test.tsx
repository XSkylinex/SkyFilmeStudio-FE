import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { PropCard } from '@/features/props/components/prop-card';
import { renderInApp } from '../../../../render-in-app';
import { buildProp } from '../../../../fixtures/prop.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const server = mockOrchestratorServer();

beforeAll(() => {
  if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    HTMLDialogElement.prototype.showModal = function (
      this: HTMLDialogElement,
    ): void {
      this.open = true;
    };
  }
  if (typeof HTMLDialogElement.prototype.close !== 'function') {
    HTMLDialogElement.prototype.close = function (
      this: HTMLDialogElement,
    ): void {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    };
  }
});

describe('PropCard', () => {
  it('offers Edit on a draft prop, prefilled with its current values', async () => {
    const user = userEvent.setup();
    const prop = buildProp();

    renderInApp(<PropCard projectId={PROJECT_ID} prop={prop} />);

    expect(
      screen.queryByText(/frozen and cannot be edited/),
    ).not.toBeInTheDocument();

    await user.click(await screen.findByRole('button', { name: /^Edit/ }));

    expect(
      await screen.findByRole('heading', { name: 'Edit this prop' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Brass compass');
  });

  it('freezes an approved prop instead of offering Edit', async () => {
    const prop = buildProp({ approved: true });

    renderInApp(<PropCard projectId={PROJECT_ID} prop={prop} />);

    expect(
      await screen.findByText(/frozen and cannot be edited/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Edit/ }),
    ).not.toBeInTheDocument();
  });

  it('announces the approval it just made, and lands focus on it', async () => {
    const user = userEvent.setup();
    const draft = buildProp();
    const approved = buildProp({ id: draft.id, approved: true });

    server.use(
      http.post(API_PATH.approveProp(PROJECT_ID, draft.id), () =>
        HttpResponse.json(approved),
      ),
    );

    const view = renderInApp(<PropCard projectId={PROJECT_ID} prop={draft} />);

    await user.click(await screen.findByRole('button', { name: /^Approve/ }));

    view.rerender(<PropCard projectId={PROJECT_ID} prop={approved} />);

    const announcement = await screen.findByText('Approved.');

    expect(announcement.tagName).toBe('OUTPUT');
    expect(announcement).toHaveFocus();
  });

  it('does not announce an approval it did not make, so an already-approved prop never steals focus', () => {
    renderInApp(
      <PropCard projectId={PROJECT_ID} prop={buildProp({ approved: true })} />,
    );

    expect(screen.queryByText('Approved.')).not.toBeInTheDocument();
    expect(document.body).toHaveFocus();
  });
});
