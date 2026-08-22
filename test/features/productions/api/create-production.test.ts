import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  projectIdSchema,
  styleProfileIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { CreateProductionRequest } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { createProductionMutationOptions } from '@/features/productions/api/create-production.mutation';
import { productionsQueryOptions } from '@/features/productions/api/productions.query';
import { buildProduction } from '../../../fixtures/production.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const REQUEST: CreateProductionRequest = {
  productionKind: 'EPISODE',
  title: 'Pilot',
  narrativeMode: 'SCREENPLAY',
  targetRuntimeSeconds: 1_200,
  styleProfileId: styleProfileIdSchema.parse(
    '11111111-1111-4111-8111-111111111111',
  ),
};

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      createProductionMutationOptions(PROJECT_ID, queryClient),
    );

describe('createProductionMutationOptions', () => {
  it('POSTs the request as a JSON body and resolves to the created production', async () => {
    const created = buildProduction();

    let capturedRequest: Request | undefined;
    server.use(
      http.post(API_PATH.productions(PROJECT_ID), ({ request }) => {
        capturedRequest = request;
        return HttpResponse.json(created);
      }),
    );

    const queryClient = buildQueryClient();

    await expect(buildMutation(queryClient).execute(REQUEST)).resolves.toEqual(
      created,
    );

    expect(capturedRequest?.method).toBe('POST');
    expect(capturedRequest?.headers.get('content-type')).toBe(
      'application/json',
    );
    await expect(capturedRequest?.json()).resolves.toEqual(REQUEST);
  });

  it('does not invalidate the productions list until the server confirms the creation', async () => {
    let resolveResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });
    const created = buildProduction();

    let listCalls = 0;
    server.use(
      http.get(API_PATH.productions(PROJECT_ID), () => {
        listCalls += 1;
        return HttpResponse.json({ items: [] });
      }),
      http.post(API_PATH.productions(PROJECT_ID), async () => {
        await gate;
        return HttpResponse.json(created);
      }),
    );

    const queryClient = buildQueryClient();
    await queryClient.fetchQuery(productionsQueryOptions(PROJECT_ID));
    expect(listCalls).toBe(1);

    const pending = buildMutation(queryClient).execute(REQUEST);

    expect(listCalls).toBe(1);

    resolveResponse?.();
    await expect(pending).resolves.toEqual(created);

    await queryClient.fetchQuery(productionsQueryOptions(PROJECT_ID));
    expect(listCalls).toBe(2);
  });

  it('rejects with a not-found status when the style profile does not exist', async () => {
    server.use(
      http.post(API_PATH.productions(PROJECT_ID), () =>
        HttpResponse.json(
          { statusCode: 404, message: 'No style profile in project' },
          { status: 404 },
        ),
      ),
    );

    const queryClient = buildQueryClient();

    await expect(
      buildMutation(queryClient).execute(REQUEST),
    ).rejects.toMatchObject({ kind: 'HTTP', status: 404, code: undefined });
  });
});
