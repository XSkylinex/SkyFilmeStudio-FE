import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { formatDuration } from '@/lib/format/format-duration';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { productionProfilesQueryOptions } from '@/features/productions/api/production-profiles.query';
import { CreateProductionProfileForm } from '@/features/productions/components/create-production-profile-form';
import type { ProductionProfileListProps } from './production-profile-list.interface';
import './production-profile-list.css';

export const ProductionProfileList: FC<ProductionProfileListProps> = ({
  projectId,
}) => {
  const translate = useTranslate();
  const profiles = useQuery(productionProfilesQueryOptions(projectId));
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <section className="production-profile-list">
      <div className="production-profile-list__header">
        <h2 className="production-profile-list__title">
          {translate('productions.profiles.heading')}
        </h2>
        <Button
          type="button"
          variant="secondary"
          size="md"
          aria-expanded={isCreateOpen}
          onClick={() => setIsCreateOpen(true)}
        >
          {translate('productions.profiles.create.open')}
        </Button>
      </div>
      <p className="production-profile-list__explain">
        {translate('productions.profiles.explain')}
      </p>

      {isCreateOpen ? (
        <CreateProductionProfileForm
          projectId={projectId}
          onClose={() => setIsCreateOpen(false)}
        />
      ) : null}

      {profiles.error && profiles.data === undefined ? (
        <ErrorState
          title={translate('productions.profiles.error.title')}
          description={composeRouteErrorDescription(
            resolveRouteErrorView(profiles.error),
            translate,
          )}
          detail={resolveRouteErrorView(profiles.error).detail}
          headingLevel={3}
        />
      ) : null}

      {profiles.isPending ? (
        <>
          <output className="production-profile-list__loading">
            {translate('productions.profiles.loading')}
          </output>
          <Skeleton shape="rect" />
        </>
      ) : null}

      {profiles.data === undefined ? null : profiles.data.items.length === 0 ? (
        <EmptyState
          title={translate('productions.profiles.empty.title')}
          description={translate('productions.profiles.empty.description')}
          headingLevel={3}
        />
      ) : (
        <ul className="production-profile-list__items">
          {profiles.data.items.map((profile) => {
            const reusable = profile.sections.filter(
              (section) => section.reusable,
            ).length;

            return (
              <li className="production-profile-list__item" key={profile.id}>
                <h3 className="production-profile-list__name">
                  <ContentText>{profile.name}</ContentText>
                </h3>
                {profile.description === undefined ? null : (
                  <p className="production-profile-list__description">
                    <ContentText>{profile.description}</ContentText>
                  </p>
                )}
                <dl className="production-profile-list__figures">
                  <dt>{translate('productions.profiles.target')}</dt>
                  <dd>
                    <span
                      className="production-profile-list__notation"
                      dir="ltr"
                    >
                      {formatDuration(profile.targetRuntimeSeconds)}
                    </span>
                  </dd>
                  <dt>{translate('productions.profiles.tolerance')}</dt>
                  <dd>
                    <span
                      className="production-profile-list__notation"
                      dir="ltr"
                    >
                      {formatDuration(profile.toleranceSeconds)}
                    </span>
                  </dd>
                  <dt>{translate('productions.profiles.frame')}</dt>
                  <dd>
                    <span
                      className="production-profile-list__notation"
                      dir="ltr"
                    >
                      {translate('productions.profiles.frame.value', {
                        width: String(profile.width),
                        height: String(profile.height),
                        fps: String(profile.fps),
                      })}
                    </span>
                  </dd>
                  <dt>{translate('productions.profiles.audio')}</dt>
                  <dd>
                    <span
                      className="production-profile-list__notation"
                      dir="ltr"
                    >
                      {translate('productions.profiles.audio.value', {
                        sampleRate: String(profile.sampleRateHz),
                        channels: String(profile.audioChannels),
                      })}
                    </span>
                  </dd>
                  <dt>{translate('productions.profiles.sections')}</dt>
                  <dd>
                    {profile.sections.length === 0
                      ? translate('productions.profiles.sections.none')
                      : translate('productions.profiles.sections.value', {
                          count: String(profile.sections.length),
                          reusable: String(reusable),
                        })}
                  </dd>
                </dl>
              </li>
            );
          })}
        </ul>
      )}

      {profiles.data?.nextCursor === undefined ? null : (
        <p className="production-profile-list__truncated">
          {translate('productions.profiles.truncated')}
        </p>
      )}
    </section>
  );
};
