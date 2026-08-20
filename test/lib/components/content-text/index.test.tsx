import { screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import { ContentText } from '@/lib/components/content-text';

describe('ContentText', () => {
  it('renders a Hebrew line right-to-left even though the interface is English', () => {
    renderInStore(<ContentText language="he">שלום</ContentText>);

    expect(screen.getByText('שלום')).toHaveAttribute('dir', 'rtl');
    expect(document.documentElement.dir).not.toBe('rtl');
  });

  it('renders an English line left-to-right', () => {
    renderInStore(<ContentText language="en-GB">Hello</ContentText>);

    expect(screen.getByText('Hello')).toHaveAttribute('dir', 'ltr');
  });

  it('lets the browser decide when the record carries no language', () => {
    renderInStore(<ContentText>Hello</ContentText>);

    expect(screen.getByText('Hello')).toHaveAttribute('dir', 'auto');
  });

  it('isolates the run so a Latin product name inside a Hebrew line cannot reorder it', () => {
    renderInStore(<ContentText language="he">ComfyUI נכשל</ContentText>);

    expect(screen.getByText('ComfyUI נכשל').tagName).toBe('BDI');
  });
});
