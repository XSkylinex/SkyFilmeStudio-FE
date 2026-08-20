import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/layers.css';
import './styles/reset.css';
import './styles/tokens.css';
import { App } from '@/App';
import { readStoredInterfaceLanguage } from '@/lib/i18n/helpers/read-stored-interface-language';
import { resolveTextDirection } from '@/lib/i18n/helpers/resolve-text-direction';
import { applyDocumentLanguage } from '@/shell/helpers/apply-document-language';

const ROOT_ELEMENT_ID = 'root';

const container = document.getElementById(ROOT_ELEMENT_ID);

if (!container) {
  throw new Error(
    `Local AI Studio cannot mount: the document has no #${ROOT_ELEMENT_ID} element.`,
  );
}

const bootLanguage = readStoredInterfaceLanguage();

applyDocumentLanguage(bootLanguage, resolveTextDirection(bootLanguage));

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
