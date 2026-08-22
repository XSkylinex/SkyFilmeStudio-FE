import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approvedCanonicalSetQueryOptions } from '@/features/subjects/api/approved-canonical-set.query';
import { CanonicalSetPanel } from '@/features/subjects/components/canonical-set-panel';
import { CanonicalReferences } from '@/features/subjects/components/canonical-references';
import type { CanonicalSectionProps } from './canonical-section.interface';

export const CanonicalSection: FC<CanonicalSectionProps> = ({
  projectId,
  subjectId,
}) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    approvedCanonicalSetQueryOptions(projectId, subjectId),
  );

  if (error) {
    const errorView = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('subjectReview.canonical.error.title')}
        description={composeRouteErrorDescription(errorView, translate)}
        detail={errorView.detail}
        headingLevel={2}
      />
    );
  }

  if (isPending) {
    return <Skeleton shape="rect" />;
  }

  return (
    <>
      <CanonicalSetPanel set={data} />
      {data === null ? null : (
        <CanonicalReferences
          projectId={projectId}
          subjectId={subjectId}
          setId={data.id}
          headingLevel={2}
        />
      )}
    </>
  );
};
