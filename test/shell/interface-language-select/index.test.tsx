import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInStore } from '../../render-in-store';
import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';
import { HE_CATALOGUE } from '@/lib/i18n/catalogue/he';
import { InterfaceLanguageSelect } from '@/shell/interface-language-select';

describe('InterfaceLanguageSelect', () => {
  it('offers each language under its own name, not a translated one', () => {
    renderInStore(<InterfaceLanguageSelect />);

    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'עברית' })).toBeInTheDocument();
  });

  it('retranslates the interface when a language is chosen', async () => {
    renderInStore(<InterfaceLanguageSelect />);

    expect(
      screen.getByLabelText(EN_CATALOGUE['language.label']),
    ).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByRole('combobox'), 'he');

    expect(
      screen.getByLabelText(HE_CATALOGUE['language.label']),
    ).toBeInTheDocument();
  });
});
