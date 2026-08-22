import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { canonicalReferencesQueryOptions } from '@/features/subjects/api/canonical-references.query';
import { CanonicalReferenceGrid } from '@/features/subjects/components/canonical-reference-grid';
import type { CanonicalReferencesProps } from './canonical-references.interface';

export const CanonicalReferences: FC<CanonicalReferencesProps> = ({
  projectId,
  subjectId,
  setId,
}) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    canonicalReferencesQueryOptions(projectId, subjectId, setId),
  );

  if (error) {
    const errorView = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('subjectReview.references.error.title')}
        description={composeRouteErrorDescription(errorView, translate)}
        detail={errorView.detail}
        headingLevel={2}
      />
    );
  }

  if (isPending) {
    return <Skeleton shape="rect" />;
  }

  return <CanonicalReferenceGrid projectId={projectId} references={data} />;
};
