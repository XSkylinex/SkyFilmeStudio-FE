import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { Skeleton } from '@/lib/components/skeleton';

const stylesheet = (): string =>
  readFileSync(
    join(process.cwd(), 'src/lib/components/skeleton/skeleton.css'),
    'utf8',
  );

describe('Skeleton', () => {
  it('is hidden from assistive technology, because it says nothing a reader needs', () => {
    const { container } = render(<Skeleton shape="rect" />);

    expect(container.querySelector('.skeleton')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('caps a rect so a full-width one cannot grow to the height of a page', () => {
    expect(stylesheet()).toMatch(
      /\[data-shape='rect'\][\s\S]*?max-block-size: var\(--skeleton-rect-max-block-size\)/,
    );
    expect(stylesheet()).toMatch(/--skeleton-rect-max-block-size: [\d.]+rem/);
  });

  it('keeps the ratio, so a rect inside a column is still shaped like the media it stands for', () => {
    expect(stylesheet()).toMatch(
      /\[data-shape='rect'\][\s\S]*?aspect-ratio: 16 \/ 9/,
    );
  });
});
