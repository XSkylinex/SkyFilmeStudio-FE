import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';
import { http, HttpResponse } from 'msw';
import {
  ERROR_CODE,
  projectBibleVersionIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestText } from '@/lib/api/request-text';
import { mockOrchestratorServer } from './msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const BIBLE_ID = projectBibleVersionIdSchema.parse(
  '77777777-7777-4777-8777-777777777777',
);

const TEXT_PATH = API_PATH.projectBibleMarkdown(PROJECT_ID, BIBLE_ID);

const server = mockOrchestratorServer();

const markdown = (body: string): Response =>
  HttpResponse.text(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });

describe('requestText', () => {
  it('resolves to the response body as plain text, not a parsed value', async () => {
    server.use(
      http.get(TEXT_PATH, () =>
        HttpResponse.text('# World\n\nDiffuse, even lighting.', {
          headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
        }),
      ),
    );

    await expect(requestText(TEXT_PATH)).resolves.toBe(
      '# World\n\nDiffuse, even lighting.',
    );
  });

  it('sends an Accept header of text/markdown when the caller has not set one', async () => {
    let capturedRequest: Request | undefined;
    server.use(
      http.get(TEXT_PATH, ({ request }) => {
        capturedRequest = request;
        return markdown('body');
      }),
    );

    await requestText(TEXT_PATH);

    expect(capturedRequest?.headers.get('accept')).toBe('text/markdown');
  });

  it('leaves a caller-supplied Accept header untouched', async () => {
    let capturedRequest: Request | undefined;
    server.use(
      http.get(TEXT_PATH, ({ request }) => {
        capturedRequest = request;
        return markdown('body');
      }),
    );

    await requestText(TEXT_PATH, { headers: { Accept: 'text/plain' } });

    expect(capturedRequest?.headers.get('accept')).toBe('text/plain');
  });

  it("maps the orchestrator's own error envelope to its guidance sentence", async () => {
    server.use(
      http.get(TEXT_PATH, () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: ERROR_CODE.PROJECT_BIBLE_IMMUTABLE,
            message: 'This project bible has already been published.',
          },
          { status: 409 },
        ),
      ),
    );

    await expect(requestText(TEXT_PATH)).rejects.toMatchObject({
      kind: 'HTTP',
      code: ERROR_CODE.PROJECT_BIBLE_IMMUTABLE,
      status: 409,
      message: EN_CATALOGUE['error.PROJECT_BIBLE_IMMUTABLE'],
    });
  });

  it('names the status in the sentence for a plain Nest error body with no typed code', async () => {
    server.use(
      http.get(TEXT_PATH, () =>
        HttpResponse.json(
          { statusCode: 404, message: 'Not Found', error: 'Not Found' },
          { status: 404 },
        ),
      ),
    );

    await expect(requestText(TEXT_PATH)).rejects.toMatchObject({
      kind: 'HTTP',
      code: undefined,
      status: 404,
    });
  });

  it('throws a NETWORK StudioError when the orchestrator cannot be reached at all', async () => {
    server.use(http.get(TEXT_PATH, () => HttpResponse.error()));

    await expect(requestText(TEXT_PATH)).rejects.toMatchObject({
      kind: 'NETWORK',
    });
  });

  it('rethrows a cancellation untouched, so it is never reported as an unreachable orchestrator', async () => {
    server.use(http.get(TEXT_PATH, () => markdown('body')));

    const controller = new AbortController();
    controller.abort();

    await expect(
      requestText(TEXT_PATH, { signal: controller.signal }),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('sends the request to the orchestrator origin and nowhere else', async () => {
    const wrongOriginHandler = vi.fn<() => Response>(() =>
      markdown('wrong host'),
    );

    server.use(
      http.get(`https://example.com${TEXT_PATH}`, wrongOriginHandler),
      http.get(TEXT_PATH, () => markdown('right host')),
    );

    await requestText(TEXT_PATH);

    expect(wrongOriginHandler).not.toHaveBeenCalled();
  });
  it('refuses a 200 that is not the document asked for, so an SPA fallback never reads as bible text', async () => {
    server.use(
      http.get(TEXT_PATH, () =>
        HttpResponse.html('<!doctype html><title>Local AI Studio</title>'),
      ),
    );

    await expect(requestText(TEXT_PATH)).rejects.toMatchObject({
      kind: 'MALFORMED',
      status: 200,
    });
  });
});
