import { isEditableTarget } from '@/shell/keyboard/helpers/is-editable-target';

describe('isEditableTarget', () => {
  it('treats an input as editable', () => {
    expect(isEditableTarget(document.createElement('input'))).toBe(true);
  });

  it('treats a textarea as editable', () => {
    expect(isEditableTarget(document.createElement('textarea'))).toBe(true);
  });

  it('treats a select as editable', () => {
    expect(isEditableTarget(document.createElement('select'))).toBe(true);
  });

  it('treats a contenteditable element as editable', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    expect(isEditableTarget(div)).toBe(true);
  });

  it('treats an element with an empty contenteditable attribute as editable', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', '');
    expect(isEditableTarget(div)).toBe(true);
  });

  it('does not treat a plain button as editable', () => {
    expect(isEditableTarget(document.createElement('button'))).toBe(false);
  });

  it('does not treat a null target as editable', () => {
    expect(isEditableTarget(null)).toBe(false);
  });
});
