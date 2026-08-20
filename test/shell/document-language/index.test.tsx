import { act } from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { createStore } from '@/shell/store';
import { interfaceLanguageSet } from '@/shell/shell.slice';
import { DocumentLanguage } from '@/shell/document-language';

describe('DocumentLanguage', () => {
  it('writes the interface language and its direction onto the document', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <DocumentLanguage />
      </Provider>,
    );

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('flips direction when the language changes, without remounting the app', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <DocumentLanguage />
      </Provider>,
    );

    act(() => {
      store.dispatch(interfaceLanguageSet('he'));
    });

    expect(document.documentElement.lang).toBe('he');
    expect(document.documentElement.dir).toBe('rtl');

    act(() => {
      store.dispatch(interfaceLanguageSet('en'));
    });

    expect(document.documentElement.dir).toBe('ltr');
  });
});
