import { renderInStore } from '../../../render-in-store';
import { StatusDot } from '@/lib/components/status-dot';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import type { StatusTone } from '@/lib/interfaces/status-tone';

const renderDot = (tone: StatusTone): Element | null => {
  const { container } = renderInStore(<StatusDot tone={tone} />);
  return container.querySelector('.status-dot');
};

describe('StatusDot', () => {
  it('is decorative, so it never reaches assistive tech on its own', () => {
    expect(renderDot(STATUS_TONE.SUCCESS)).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('carries its tone on data-tone', () => {
    expect(renderDot(STATUS_TONE.DANGER)).toHaveAttribute(
      'data-tone',
      'danger',
    );
  });

  it('gives every tone a form, so the dot never renders with an empty non-colour channel', () => {
    Object.values(STATUS_TONE).forEach((tone) => {
      expect(renderDot(tone)?.getAttribute('data-form')).toBeTruthy();
    });
  });

  it('gives success, warning, danger and attention four different forms, so they survive colour being removed', () => {
    const forms = [
      STATUS_TONE.SUCCESS,
      STATUS_TONE.WARNING,
      STATUS_TONE.DANGER,
      STATUS_TONE.ATTENTION,
    ].map((tone) => renderDot(tone)?.getAttribute('data-form'));

    expect(new Set(forms).size).toBe(4);
  });
});
