import { PREFLIGHT_STATUS } from 'sky-filme-studio-be/contracts';
import type { PreflightReport } from 'sky-filme-studio-be/contracts';
import type { SystemReadinessView } from '../system-readiness.interface';

const didNotPass = (status: PreflightReport['checks'][number]['status']) =>
  status !== PREFLIGHT_STATUS.PASS &&
  status !== PREFLIGHT_STATUS.NOT_APPLICABLE;

export const resolveSystemReadiness = (
  report: PreflightReport | undefined,
): SystemReadinessView => {
  if (!report) {
    return { state: 'unknown', failed: 0, total: 0 };
  }

  const failed = report.checks.filter((check) =>
    didNotPass(check.status),
  ).length;

  return {
    state: report.passed && failed === 0 ? 'ready' : 'blocked',
    failed,
    total: report.checks.length,
  };
};
