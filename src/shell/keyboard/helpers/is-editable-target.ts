const EDITABLE_TAG_NAMES = new Set(['INPUT', 'TEXTAREA', 'SELECT']);
const SPACE_ACTIVATED_TAG_NAMES = new Set(['BUTTON']);
const SPACE_KEY = ' ';

export const isEditableTarget = (
  target: EventTarget | null,
  key: string,
): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (EDITABLE_TAG_NAMES.has(target.tagName)) {
    return true;
  }
  if (target.isContentEditable) {
    return true;
  }

  const contentEditableAttribute = target.getAttribute('contenteditable');
  if (contentEditableAttribute === '' || contentEditableAttribute === 'true') {
    return true;
  }

  return key === SPACE_KEY && SPACE_ACTIVATED_TAG_NAMES.has(target.tagName);
};
