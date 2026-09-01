import { queryOptions } from '@tanstack/react-query';
import { qcRunSchema } from 'sky-filme-studio-be/contracts';
import type { ShotId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { SHOT_QC_RUNS_STALE_TIME_MS } from '@/lib/query/query.constants';
import { shotQcQueryKey } from '@/features/shots/helpers/shot-qc-query-key';

const qcRunsSchema = qcRunSchema.array();

export const shotQcRunsQueryKey = (shotId: ShotId): string[] => [
  ...shotQcQueryKey(shotId),
  'runs',
];

export const shotQcRunsQueryOptions = (shotId: ShotId) =>
  queryOptions({
    queryKey: shotQcRunsQueryKey(shotId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.shotQcRuns(shotId), qcRunsSchema, { signal }),
    staleTime: SHOT_QC_RUNS_STALE_TIME_MS,
  });
