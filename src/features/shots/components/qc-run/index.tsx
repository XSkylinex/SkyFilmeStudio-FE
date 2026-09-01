import type { FC } from 'react';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { formatDateTime } from '@/lib/format/format-date-time';
import { useTranslate } from '@/lib/i18n/use-translate';
import { QC_CHECK_OUTCOME_TONE } from '@/lib/status-tone/qc-check-outcome.tone';
import { QC_OUTCOME_TONE } from '@/lib/status-tone/qc-outcome.tone';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';
import {
  QC_CHECK_ID_LABEL,
  QC_CHECK_OUTCOME_LABEL,
  QC_OUTCOME_LABEL,
  QC_RUN_KIND_LABEL,
} from '@/features/shots/shots.constants';
import type { QcRunProps } from './qc-run.interface';
import './qc-run.css';

const describe = (value: unknown): string =>
  typeof value === 'string' ? value : JSON.stringify(value);

export const QcRunView: FC<QcRunProps> = ({ run }) => {
  const translate = useTranslate();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);

  const provenance: Array<[string, string | undefined]> = [
    [translate('shots.qc.run.provider'), run.providerId],
    [translate('shots.qc.run.model'), run.modelManifestId],
    [translate('shots.qc.run.worker'), run.workerId],
    [translate('shots.qc.run.hardware'), run.hardwareProfileId],
    [
      translate('shots.qc.run.styleVersion'),
      run.styleProfileVersion === undefined
        ? undefined
        : String(run.styleProfileVersion),
    ],
    [
      translate('shots.qc.run.promptSpecVersion'),
      run.promptSpecVersion === undefined
        ? undefined
        : String(run.promptSpecVersion),
    ],
  ];

  return (
    <li className="qc-run">
      <div className="qc-run__header">
        <span className="qc-run__kind">
          {translate(QC_RUN_KIND_LABEL[run.kind])}
        </span>
        <Badge
          tone={QC_OUTCOME_TONE[run.outcome]}
          label={translate(QC_OUTCOME_LABEL[run.outcome])}
        />
        <span className="qc-run__ran">
          {translate('shots.qc.run.created')}{' '}
          {formatDateTime(run.createdAt, interfaceLanguage)}
        </span>
      </div>

      {run.checks.length === 0 ? null : (
        <ul className="qc-run__checks">
          {run.checks.map((check) => (
            <li key={check.check} className="qc-run__check">
              <Badge
                tone={QC_CHECK_OUTCOME_TONE[check.outcome]}
                label={translate(QC_CHECK_OUTCOME_LABEL[check.outcome])}
              />
              <span>{translate(QC_CHECK_ID_LABEL[check.check])}</span>
              {check.observed === undefined ? null : (
                <span className="qc-run__measure">
                  {translate('shots.qc.check.observed')}{' '}
                  <span dir="ltr">{check.observed}</span>
                </span>
              )}
              {check.expected === undefined ? null : (
                <span className="qc-run__measure">
                  {translate('shots.qc.check.expected')}{' '}
                  <span dir="ltr">{check.expected}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {run.findings.length === 0 ? null : (
        <div className="qc-run__findings">
          <p className="qc-run__note">
            {translate('shots.qc.run.findings', {
              count: String(run.findings.length),
            })}{' '}
            {translate('shots.qc.run.findingsUnstructured')}
          </p>
          <ul className="qc-run__finding-list">
            {run.findings.map((finding, index) => (
              <li key={index} className="qc-run__finding">
                {Object.entries(finding).map(([key, value]) => (
                  <span key={key} className="qc-run__finding-entry">
                    <span className="qc-run__finding-key" dir="ltr">
                      {key}
                    </span>{' '}
                    <ContentText>{describe(value)}</ContentText>
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}

      <dl className="qc-run__provenance">
        {provenance.map(([label, value]) =>
          value === undefined ? null : (
            <div key={label} className="qc-run__fact">
              <dt>{label}</dt>
              <dd>
                <span className="qc-run__id" dir="ltr">
                  {value}
                </span>
              </dd>
            </div>
          ),
        )}
      </dl>
    </li>
  );
};
