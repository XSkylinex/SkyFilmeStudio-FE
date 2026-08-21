import { fireEvent } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import { MediaTile } from '@/lib/components/media-tile';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '@/shell/store';
import { interfaceLanguageSet } from '@/shell/shell.slice';

describe('MediaTile', () => {
  it('reserves its box from the ratio alone when there is nothing to show yet', () => {
    const { container } = renderInStore(<MediaTile alt="Keyframe candidate" />);
    const tile = container.querySelector('.media-tile');

    expect(tile).toHaveAttribute('data-ratio', '16:9');
    expect(tile).toHaveAttribute('data-state', 'empty');
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(tile).toHaveTextContent('No image yet');
  });

  it('reserves a non-default ratio the same way, before any image exists', () => {
    const { container } = renderInStore(
      <MediaTile alt="Keyframe candidate" ratio="9:16" />,
    );

    expect(container.querySelector('.media-tile')).toHaveAttribute(
      'data-ratio',
      '9:16',
    );
  });

  it('starts loading and shows the shared Skeleton, not an invented shimmer', () => {
    const { container } = renderInStore(
      <MediaTile src="data:image/png;base64,AAAA" alt="Keyframe candidate" />,
    );
    const tile = container.querySelector('.media-tile');

    expect(tile).toHaveAttribute('data-state', 'loading');
    expect(container.querySelector('.skeleton')).toBeInTheDocument();
  });

  it('marks the image lazy and async-decoded', () => {
    const { container } = renderInStore(
      <MediaTile src="data:image/png;base64,AAAA" alt="Keyframe candidate" />,
    );
    const image = container.querySelector('img');

    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
  });

  it('does not measure or reserve from image dimensions, only from the ratio prop', () => {
    const { container } = renderInStore(
      <MediaTile src="data:image/png;base64,AAAA" alt="Keyframe candidate" />,
    );
    const image = container.querySelector('img');

    expect(image).not.toHaveAttribute('width');
    expect(image).not.toHaveAttribute('height');
  });

  it('goes ready once the image decodes, dropping the skeleton', () => {
    const { container } = renderInStore(
      <MediaTile src="data:image/png;base64,AAAA" alt="Keyframe candidate" />,
    );
    const image = container.querySelector('img');
    if (!image) {
      throw new Error('expected an img while src is set');
    }

    fireEvent.load(image);

    expect(container.querySelector('.media-tile')).toHaveAttribute(
      'data-state',
      'ready',
    );
    expect(container.querySelector('.skeleton')).not.toBeInTheDocument();
  });

  it('goes to failed on a decode error and renders legible text, not a broken-image glyph', () => {
    const { container } = renderInStore(
      <MediaTile src="data:image/png;base64,broken" alt="Keyframe candidate" />,
    );
    const image = container.querySelector('img');
    if (!image) {
      throw new Error('expected an img while src is set');
    }

    fireEvent.error(image);
    const tile = container.querySelector('.media-tile');

    expect(tile).toHaveAttribute('data-state', 'failed');
    expect(tile).toHaveTextContent('Failed to load');
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('resets to loading when src changes, so a recycled grid cell drops the previous outcome', () => {
    const { container, rerender } = renderInStore(
      <MediaTile src="data:image/png;base64,one" alt="First keyframe" />,
    );
    const firstImage = container.querySelector('img');
    if (!firstImage) {
      throw new Error('expected an img while src is set');
    }
    fireEvent.load(firstImage);
    expect(container.querySelector('.media-tile')).toHaveAttribute(
      'data-state',
      'ready',
    );

    rerender(
      <MediaTile src="data:image/png;base64,two" alt="Second keyframe" />,
    );

    expect(container.querySelector('.media-tile')).toHaveAttribute(
      'data-state',
      'loading',
    );
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'data:image/png;base64,two',
    );
  });

  it('drops back to empty when a later src is removed entirely', () => {
    const { container, rerender } = renderInStore(
      <MediaTile src="data:image/png;base64,one" alt="First keyframe" />,
    );

    rerender(<MediaTile alt="First keyframe" />);

    const tile = container.querySelector('.media-tile');
    expect(tile).toHaveAttribute('data-state', 'empty');
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('shows the caption only when one is given', () => {
    const { container, rerender } = renderInStore(
      <MediaTile alt="Keyframe candidate" />,
    );

    expect(
      container.querySelector('.media-tile__caption'),
    ).not.toBeInTheDocument();

    rerender(<MediaTile alt="Keyframe candidate" caption="Scene 4, take 2" />);

    expect(container.querySelector('.media-tile__caption')).toHaveTextContent(
      'Scene 4, take 2',
    );
  });
  it('translates its fallback copy, so an RTL gallery is not dotted with English', () => {
    const store = createStore();
    store.dispatch(interfaceLanguageSet('he'));

    const { getByText } = render(
      <Provider store={store}>
        <MediaTile alt="Keyframe candidate" />
      </Provider>,
    );

    expect(getByText('אין תמונה עדיין')).toBeInTheDocument();
  });
});
