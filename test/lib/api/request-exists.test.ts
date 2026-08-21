import { http, HttpResponse } from 'msw';
import { API_PATH } from '@/lib/api/api.constants';
import { requestExists } from '@/lib/api/request-exists';
import { mockOrchestratorServer } from './msw-server';

const server = mockOrchestratorServer();

const PATH = API_PATH.systemMode();

describe('requestExists', () => {
  it('reports a resource the orchestrator has', async () => {
    server.use(http.head(PATH, () => new HttpResponse(null, { status: 200 })));

    await expect(requestExists(PATH)).resolves.toBe(true);
  });

  it('reports an absent resource as absent, not as a failure', async () => {
    server.use(http.head(PATH, () => new HttpResponse(null, { status: 404 })));

    await expect(requestExists(PATH)).resolves.toBe(false);
  });

  it('asks without downloading, so a large file costs nothing to check', async () => {
    let method: string | undefined;
    server.use(
      http.head(PATH, ({ request }) => {
        method = request.method;
        return new HttpResponse(null, { status: 200 });
      }),
    );

    await requestExists(PATH);

    expect(method).toBe('HEAD');
  });

  it('does not answer "absent" when it could not find out', async () => {
    server.use(http.head(PATH, () => new HttpResponse(null, { status: 500 })));

    await expect(requestExists(PATH)).rejects.toMatchObject({
      kind: 'HTTP',
      status: 500,
    });
  });

  it('separates an unreachable orchestrator from an absent file', async () => {
    server.use(http.head(PATH, () => HttpResponse.error()));

    await expect(requestExists(PATH)).rejects.toMatchObject({
      kind: 'NETWORK',
    });
  });

  it('lets a cancellation through rather than reporting it as a failure', async () => {
    server.use(http.head(PATH, () => new HttpResponse(null, { status: 200 })));
    const controller = new AbortController();
    controller.abort();

    await expect(
      requestExists(PATH, { signal: controller.signal }),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });
});
