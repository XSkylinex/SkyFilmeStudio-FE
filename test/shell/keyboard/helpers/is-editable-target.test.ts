import { isEditableTarget } from '@/shell/keyboard/helpers/is-editable-target';

describe('isEditableTarget', () => {
  it('treats an input as editable regardless of the key pressed', () => {
    expect(isEditableTarget(document.createElement('input'), 'a')).toBe(true);
  });

  it('treats a textarea as editable', () => {
    expect(isEditableTarget(document.createElement('textarea'), 'a')).toBe(
      true,
    );
  });

  it('treats a select as editable', () => {
    expect(isEditableTarget(document.createElement('select'), 'a')).toBe(true);
  });

  it('treats a contenteditable element as editable', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    expect(isEditableTarget(div, 'a')).toBe(true);
  });

  it('treats an element with an empty contenteditable attribute as editable', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', '');
    expect(isEditableTarget(div, 'a')).toBe(true);
  });

  it('does not treat a plain button as editable for a letter key', () => {
    expect(isEditableTarget(document.createElement('button'), 'a')).toBe(false);
  });

  it('treats a focused button as editable for Space, so the browser can activate it natively', () => {
    expect(isEditableTarget(document.createElement('button'), ' ')).toBe(true);
  });

  it('does not treat a link as editable for Space, so the page can still scroll from a focused link', () => {
    expect(isEditableTarget(document.createElement('a'), ' ')).toBe(false);
  });

  it('does not treat a null target as editable', () => {
    expect(isEditableTarget(null, ' ')).toBe(false);
  });
});
