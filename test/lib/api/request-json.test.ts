import { http, HttpResponse } from 'msw';
import { ERROR_CODE, systemModeSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ERROR_CODE_GUIDANCE } from '@/lib/api/error-taxonomy';
import { requestJson } from '@/lib/api/request-json';
import { buildSystemMode } from '../../fixtures/system-mode.fixture';
import { mockOrchestratorServer } from './msw-server';

const SYSTEM_MODE_PATH = API_PATH.systemMode();

const server = mockOrchestratorServer();

describe('requestJson', () => {
  it('parses a valid response into typed data', async () => {
    server.use(
      http.get(SYSTEM_MODE_PATH, () => HttpResponse.json(buildSystemMode())),
    );

    await expect(
      requestJson(SYSTEM_MODE_PATH, systemModeSchema),
    ).resolves.toEqual(buildSystemMode());
  });

  it('throws a CONTRACT StudioError naming the offending path when a required field is missing', async () => {
    server.use(
      http.get(SYSTEM_MODE_PATH, () => {
        const { operatingMode: _operatingMode, ...withoutOperatingMode } =
          buildSystemMode();
        return HttpResponse.json(withoutOperatingMode);
      }),
    );

    await expect(
      requestJson(SYSTEM_MODE_PATH, systemModeSchema),
    ).rejects.toMatchObject({
      kind: 'CONTRACT',
      detail: expect.stringContaining('operatingMode'),
    });
  });

  it('maps a 500 carrying a known errorCode to its HTTP kind and guidance sentence', async () => {
    server.use(
      http.get(SYSTEM_MODE_PATH, () =>
        HttpResponse.json(
          {
            errorCode: ERROR_CODE.DISK_SPACE_LOW,
            errorDetail: 'Only 2GB free on the project volume.',
          },
          { status: 500 },
        ),
      ),
    );

    await expect(
      requestJson(SYSTEM_MODE_PATH, systemModeSchema),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      code: ERROR_CODE.DISK_SPACE_LOW,
      status: 500,
      message: ERROR_CODE_GUIDANCE[ERROR_CODE.DISK_SPACE_LOW].sentence,
    });
  });

  it('names the status in the sentence for a plain Nest error body with no typed code', async () => {
    server.use(
      http.get(SYSTEM_MODE_PATH, () =>
        HttpResponse.json(
          { statusCode: 404, message: 'Not Found', error: 'Not Found' },
          { status: 404 },
        ),
      ),
    );

    await expect(
      requestJson(SYSTEM_MODE_PATH, systemModeSchema),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      code: undefined,
      status: 404,
      message: expect.stringContaining('404'),
    });
  });

  it('throws a NETWORK StudioError when the orchestrator cannot be reached at all', async () => {
    server.use(http.get(SYSTEM_MODE_PATH, () => HttpResponse.error()));

    await expect(
      requestJson(SYSTEM_MODE_PATH, systemModeSchema),
    ).rejects.toMatchObject({ kind: 'NETWORK' });
  });

  it('sends the request to the orchestrator origin and nowhere else', async () => {
    const wrongOriginHandler = vi.fn<() => Response>(() =>
      HttpResponse.json(buildSystemMode()),
    );

    server.use(
      http.get(`https://example.com${SYSTEM_MODE_PATH}`, wrongOriginHandler),
      http.get(SYSTEM_MODE_PATH, () => HttpResponse.json(buildSystemMode())),
    );

    await requestJson(SYSTEM_MODE_PATH, systemModeSchema);

    expect(wrongOriginHandler).not.toHaveBeenCalled();
  });

  it('separates a reply that is not JSON at all from a contract mismatch', async () => {
    server.use(
      http.get(SYSTEM_MODE_PATH, () =>
        HttpResponse.html('<!doctype html><title>index</title>'),
      ),
    );

    await expect(
      requestJson(SYSTEM_MODE_PATH, systemModeSchema),
    ).rejects.toMatchObject({
      kind: 'MALFORMED',
      detail: expect.stringContaining('text/html'),
    });
  });

  it('rethrows a cancellation untouched, so it is never reported as an unreachable orchestrator', async () => {
    server.use(
      http.get(SYSTEM_MODE_PATH, () => HttpResponse.json(buildSystemMode())),
    );

    const controller = new AbortController();
    controller.abort();

    await expect(
      requestJson(SYSTEM_MODE_PATH, systemModeSchema, {
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('keeps the detail from a Nest validation body, whose message is an array', async () => {
    server.use(
      http.get(SYSTEM_MODE_PATH, () =>
        HttpResponse.json(
          {
            statusCode: 400,
            message: [
              'localOnly must be a boolean',
              'operatingMode is required',
            ],
            error: 'Bad Request',
          },
          { status: 400 },
        ),
      ),
    );

    await expect(
      requestJson(SYSTEM_MODE_PATH, systemModeSchema),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      detail: 'localOnly must be a boolean; operatingMode is required',
    });
  });
});
