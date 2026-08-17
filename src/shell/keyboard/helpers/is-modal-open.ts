export const isModalOpen = (): boolean =>
  document.querySelector('dialog[open]') !== null;
