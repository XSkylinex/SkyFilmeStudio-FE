import {
  DEFAULT_DOCUMENT_DIRECTION,
  DEFAULT_INTERFACE_LANGUAGE,
  DOCUMENT_DIRECTION,
} from '@/shell/document-language.constants';
import { applyDocumentLanguage } from '@/shell/helpers/apply-document-language';

describe('applyDocumentLanguage', () => {
  it('renders a Hebrew interface right-to-left', () => {
    applyDocumentLanguage('he', DOCUMENT_DIRECTION.RTL);

    expect(document.documentElement.lang).toBe('he');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('switches direction back when the interface leaves Hebrew', () => {
    applyDocumentLanguage('he', DOCUMENT_DIRECTION.RTL);
    applyDocumentLanguage('en', DOCUMENT_DIRECTION.LTR);

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('resolves the boot defaults to a left-to-right English document', () => {
    applyDocumentLanguage(
      DEFAULT_INTERFACE_LANGUAGE,
      DEFAULT_DOCUMENT_DIRECTION,
    );

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });
});
