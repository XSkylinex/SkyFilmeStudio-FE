import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { PropCard } from '@/features/props/components/prop-card';
import { renderInApp } from '../../../../render-in-app';
import { buildProp } from '../../../../fixtures/prop.fixture';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

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
});
