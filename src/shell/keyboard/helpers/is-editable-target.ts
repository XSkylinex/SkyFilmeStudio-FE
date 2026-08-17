const EDITABLE_TAG_NAMES = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export const isEditableTarget = (target: EventTarget | null): boolean => {
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
  return contentEditableAttribute === '' || contentEditableAttribute === 'true';
};
