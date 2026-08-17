import { isModalOpen } from '@/shell/keyboard/helpers/is-modal-open';

describe('isModalOpen', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('reports false when no dialog is present', () => {
    expect(isModalOpen()).toBe(false);
  });

  it('reports false when a dialog exists but is not open', () => {
    const dialog = document.createElement('dialog');
    document.body.append(dialog);

    expect(isModalOpen()).toBe(false);
  });

  it('reports true when a dialog is open', () => {
    const dialog = document.createElement('dialog');
    dialog.setAttribute('open', '');
    document.body.append(dialog);

    expect(isModalOpen()).toBe(true);
  });
});
