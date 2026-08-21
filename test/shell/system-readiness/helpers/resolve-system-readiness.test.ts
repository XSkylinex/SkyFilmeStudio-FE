import type {
  PreflightCheck,
  PreflightCheckId,
  PreflightStatus,
} from 'sky-filme-studio-be/contracts';
import { resolveSystemReadiness } from '@/shell/system-readiness/helpers/resolve-system-readiness';
import { buildPreflightReport } from '../../../fixtures/preflight-report.fixture';

const check = (
  id: PreflightCheckId,
  status: PreflightStatus,
): PreflightCheck => ({
  id,
  status,
  detail: 'A sentence the orchestrator wrote.',
});

describe('resolveSystemReadiness', () => {
  it('claims nothing at all before a report has arrived', () => {
    expect(resolveSystemReadiness(undefined)).toEqual({
      state: 'unknown',
      failed: 0,
      total: 0,
    });
  });

  it('is ready only when the orchestrator says so and no check disagrees', () => {
    const view = resolveSystemReadiness(
      buildPreflightReport({
        passed: true,
        checks: [
          check('DATABASE_HEALTHY', 'PASS'),
          check('COMFYUI_HEALTHY', 'NOT_APPLICABLE'),
        ],
      }),
    );

    expect(view).toEqual({ state: 'ready', failed: 0, total: 2 });
  });

  it('counts a check that did not run as a check that did not pass', () => {
    const view = resolveSystemReadiness(
      buildPreflightReport({
        passed: false,
        checks: [
          check('DATABASE_HEALTHY', 'PASS'),
          check('MODEL_SMOKE_TEST', 'NOT_IMPLEMENTED'),
          check('DISK_SPACE', 'FAIL'),
        ],
      }),
    );

    expect(view).toEqual({ state: 'blocked', failed: 2, total: 3 });
  });

  it('does not count a check that does not apply to this machine', () => {
    const view = resolveSystemReadiness(
      buildPreflightReport({
        passed: true,
        checks: [
          check('DATABASE_HEALTHY', 'PASS'),
          check('COMFYUI_HEALTHY', 'NOT_APPLICABLE'),
          check('MIGRATIONS_CURRENT', 'PASS'),
        ],
      }),
    );

    expect(view.failed).toBe(0);
    expect(view.state).toBe('ready');
  });

  it('refuses to call the machine ready when the report and its own checks disagree', () => {
    const view = resolveSystemReadiness(
      buildPreflightReport({
        passed: true,
        checks: [check('DISK_SPACE', 'FAIL')],
      }),
    );

    expect(view.state).toBe('blocked');
  });
});
