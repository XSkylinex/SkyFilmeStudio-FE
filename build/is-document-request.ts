import type { IncomingHttpHeaders } from 'node:http';

const DOCUMENT_FETCH_DEST = 'document';
const HTML_MEDIA_TYPE = 'text/html';

export const isDocumentRequest = (headers: IncomingHttpHeaders): boolean => {
  const destination = headers['sec-fetch-dest'];

  if (typeof destination === 'string') {
    return destination === DOCUMENT_FETCH_DEST;
  }

  const accept = headers.accept;

  return typeof accept === 'string' && accept.includes(HTML_MEDIA_TYPE);
};
