import { http, HttpResponse } from 'msw';
import { requestNoContent } from '@/lib/api/request-no-content';
import { mockOrchestratorServer } from './msw-server';

const server = mockOrchestratorServer();

const PATH = '/dialogue-lines/dddddddd-dddd-4ddd-8ddd-dddddddddddd';

describe('requestNoContent', () => {
  it('resolves on a 204 with no body, which requestJson would call malformed', async () => {
    server.use(
      http.delete(PATH, () => new HttpResponse(null, { status: 204 })),
    );

    await expect(
      requestNoContent(PATH, { method: 'DELETE' }),
    ).resolves.toBeUndefined();
  });

  it('carries a typed refusal through, with its code', async () => {
    server.use(
      http.delete(PATH, () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'DIALOGUE_AUDIO_IMMUTABLE',
            message: 'approved',
          },
          { status: 409 },
        ),
      ),
    );

    await expect(
      requestNoContent(PATH, { method: 'DELETE' }),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      status: 409,
      code: 'DIALOGUE_AUDIO_IMMUTABLE',
    });
  });

  it('reports a codeless failure by status alone', async () => {
    server.use(
      http.delete(PATH, () => new HttpResponse(null, { status: 404 })),
    );

    await expect(
      requestNoContent(PATH, { method: 'DELETE' }),
    ).rejects.toMatchObject({ kind: 'HTTP', status: 404, code: undefined });
  });

  it('reports a network failure as NETWORK', async () => {
    server.use(http.delete(PATH, () => HttpResponse.error()));

    await expect(
      requestNoContent(PATH, { method: 'DELETE' }),
    ).rejects.toMatchObject({ kind: 'NETWORK' });
  });
});
