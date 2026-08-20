import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import type { RequestHandler } from 'msw';
import type { SetupServer } from 'msw/node';

export const mockOrchestratorServer = (
  ...handlers: RequestHandler[]
): SetupServer => {
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  return server;
};
