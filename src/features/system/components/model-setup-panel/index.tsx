import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { formatBytes } from '@/lib/format/format-bytes';
import { useTranslate } from '@/lib/i18n/use-translate';
import { MODEL_FILE_STATUS_TONE } from '@/lib/status-tone/model-file-status.tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { modelSetupQueryOptions } from '@/shell/api/model-setup.query';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { SystemPanel } from '@/features/system/components/system-panel';
import type { SystemSectionProps } from '@/features/system/interfaces/system-section';
import {
  MODEL_FILE_STATUS_LABEL_KEY,
  MODEL_ROLE_LABEL_KEY,
} from './model-setup-panel.constants';
import './model-setup-panel.css';

export const ModelSetupPanel: FC<SystemSectionProps> = ({ headingLevel }) => {
  const translate = useTranslate();
  const { data, error } = useQuery(modelSetupQueryOptions());
  const errorView = error ? resolveRouteErrorView(error) : undefined;

  return (
    <SystemPanel
      title={translate('system.models.title')}
      headingLevel={headingLevel}
    >
      {errorView ? (
        <ErrorState
          title={translate('system.models.error.title')}
          description={composeRouteErrorDescription(errorView, translate)}
          detail={errorView.detail}
          headingLevel={headingLevel}
        />
      ) : null}

      {!errorView && !data ? (
        <>
          <Skeleton shape="text" />
          <Skeleton shape="rect" />
          <Skeleton shape="rect" />
        </>
      ) : null}

      {data ? (
        <>
          <p className="model-setup-panel__summary">
            {translate('system.models.summary', {
              ready: data.models.filter((entry) => entry.ready).length,
              total: data.models.length,
            })}
          </p>
          {data.totalMissingBytes > 0 ? (
            <p className="model-setup-panel__missing-total">
              {translate('system.models.missingTotal')}{' '}
              <span className="model-setup-panel__bytes" dir="ltr">
                {formatBytes(data.totalMissingBytes)}
              </span>
            </p>
          ) : null}
          <p className="model-setup-panel__root">
            <span className="model-setup-panel__field-label">
              {translate('system.models.root')}
            </span>
            <code className="model-setup-panel__code" dir="ltr">
              {data.modelsRoot}
            </code>
          </p>
          <p className="model-setup-panel__ready-meaning">
            {translate('system.models.readyMeaning')}
          </p>
          {data.models.length === 0 ? (
            <p className="model-setup-panel__empty">
              {translate('system.models.empty')}
            </p>
          ) : (
            <ul className="model-setup-panel__models">
              {data.models.map((entry) => (
                <li className="model-setup-panel__model" key={entry.id}>
                  <div className="model-setup-panel__model-header">
                    <code className="model-setup-panel__code" dir="ltr">
                      {entry.id}
                    </code>
                    <Badge
                      tone={STATUS_TONE.NEUTRAL}
                      label={translate(MODEL_ROLE_LABEL_KEY[entry.role])}
                    />
                    <Badge
                      tone={
                        entry.ready ? STATUS_TONE.SUCCESS : STATUS_TONE.DANGER
                      }
                      label={translate(
                        entry.ready
                          ? 'system.models.filesPresent'
                          : 'system.models.filesMissing',
                      )}
                    />
                  </div>
                  <dl className="model-setup-panel__fields">
                    <div className="model-setup-panel__field">
                      <dt>{translate('system.models.license')}</dt>
                      <dd>
                        <span className="model-setup-panel__code" dir="ltr">
                          {entry.license}
                        </span>
                      </dd>
                    </div>
                    <div className="model-setup-panel__field">
                      <dt>{translate('system.models.upstream')}</dt>
                      <dd>
                        <code className="model-setup-panel__code" dir="ltr">
                          {entry.upstreamRepo}
                        </code>
                      </dd>
                    </div>
                    <div className="model-setup-panel__field">
                      <dt>{translate('system.models.size')}</dt>
                      <dd>
                        <span className="model-setup-panel__bytes" dir="ltr">
                          {formatBytes(entry.totalBytes)}
                        </span>
                      </dd>
                    </div>
                    {entry.missingBytes > 0 ? (
                      <div className="model-setup-panel__field">
                        <dt>{translate('system.models.missing')}</dt>
                        <dd>
                          <span className="model-setup-panel__bytes" dir="ltr">
                            {formatBytes(entry.missingBytes)}
                          </span>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  <p className="model-setup-panel__files-heading">
                    {translate('system.models.files')}
                  </p>
                  <ul className="model-setup-panel__files">
                    {entry.files.map((file) => (
                      <li
                        className="model-setup-panel__file"
                        key={file.relativePath}
                      >
                        <code className="model-setup-panel__code" dir="ltr">
                          {file.relativePath}
                        </code>
                        <span
                          className="model-setup-panel__file-bytes"
                          dir="ltr"
                        >
                          {formatBytes(file.bytes)}
                        </span>
                        <Badge
                          tone={MODEL_FILE_STATUS_TONE[file.status]}
                          label={translate(
                            MODEL_FILE_STATUS_LABEL_KEY[file.status],
                          )}
                        />
                        <span className="model-setup-panel__file-detail">
                          <ContentText>{file.detail}</ContentText>
                        </span>
                      </li>
                    ))}
                  </ul>
                  {!entry.ready ? (
                    <p className="model-setup-panel__download">
                      {translate('system.models.noDownload')}{' '}
                      <code className="model-setup-panel__code" dir="ltr">
                        {entry.downloadArgv.join(' ')}
                      </code>
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </SystemPanel>
  );
};
