import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { APPROVAL_STATE } from 'sky-filme-studio-be/contracts';
import type {
  CanonicalAssetSetId,
  CanonicalReference,
  CanonicalReferenceRole,
  ProjectId,
  SubjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { mediaUrl } from '@/lib/api/media-url';
import { MediaTile } from '@/lib/components/media-tile';
import { useTranslate } from '@/lib/i18n/use-translate';
import { approvedCanonicalSetQueryOptions } from '@/features/subjects/api/approved-canonical-set.query';
import { canonicalReferencesQueryOptions } from '@/features/subjects/api/canonical-references.query';
import { canonicalSetsQueryOptions } from '@/features/subjects/api/canonical-sets.query';
import { CANONICAL_ROLE_LABEL_KEY } from '@/features/subjects/subjects.constants';
import type { CanonicalComparisonProps } from './canonical-comparison.interface';
import './canonical-comparison.css';

type Side = 'approved' | 'draft';

interface ComparisonPairsProps {
  projectId: ProjectId;
  subjectId: SubjectId;
  approvedSetId: CanonicalAssetSetId;
  draftSetId: CanonicalAssetSetId;
}

const rolesIn = (
  ...lists: ReadonlyArray<readonly CanonicalReference[]>
): CanonicalReferenceRole[] => {
  const seen: CanonicalReferenceRole[] = [];
  for (const list of lists) {
    for (const reference of list) {
      if (!seen.includes(reference.role)) {
        seen.push(reference.role);
      }
    }
  }
  return seen;
};

const ComparisonPairs: FC<ComparisonPairsProps> = ({
  projectId,
  subjectId,
  approvedSetId,
  draftSetId,
}) => {
  const translate = useTranslate();
  const approvedReferences = useQuery(
    canonicalReferencesQueryOptions(projectId, subjectId, approvedSetId),
  );
  const draftReferences = useQuery(
    canonicalReferencesQueryOptions(projectId, subjectId, draftSetId),
  );

  const left = approvedReferences.data ?? [];
  const right = draftReferences.data ?? [];
  const roles = rolesIn(left, right);

  const sideLabel = (side: Side): string =>
    translate(
      side === 'approved'
        ? 'subjectReview.comparison.approvedSide'
        : 'subjectReview.comparison.draftSide',
    );

  const tile = (
    reference: CanonicalReference | undefined,
    side: Side,
    role: CanonicalReferenceRole,
  ) => {
    const roleLabel = translate(CANONICAL_ROLE_LABEL_KEY[role]);

    if (reference === undefined) {
      return (
        <p className="canonical-comparison__missing">
          {translate('subjectReview.comparison.missingSide', {
            side: sideLabel(side),
            role: roleLabel,
          })}
        </p>
      );
    }

    return (
      <MediaTile
        ratio="1:1"
        src={
          reference.sourceAssetId === undefined
            ? undefined
            : mediaUrl(
                API_PATH.projectAssetThumbnail(
                  projectId,
                  reference.sourceAssetId,
                ),
              )
        }
        alt={translate('subjectReview.comparison.alt', {
          side: sideLabel(side),
          role: roleLabel,
        })}
      />
    );
  };

  return (
    <section className="canonical-comparison">
      <h2 className="canonical-comparison__title">
        {translate('subjectReview.comparison.title')}
      </h2>
      <p className="canonical-comparison__note">
        {translate('subjectReview.comparison.explained')}
      </p>

      <div className="canonical-comparison__legend" aria-hidden="true">
        <span>{sideLabel('approved')}</span>
        <span>{sideLabel('draft')}</span>
      </div>

      <ul className="canonical-comparison__rows">
        {roles.map((role) => (
          <li key={role} className="canonical-comparison__row">
            <h3 className="canonical-comparison__role">
              {translate(CANONICAL_ROLE_LABEL_KEY[role])}
            </h3>
            <div className="canonical-comparison__pair">
              {tile(
                left.find((reference) => reference.role === role),
                'approved',
                role,
              )}
              {tile(
                right.find((reference) => reference.role === role),
                'draft',
                role,
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const CanonicalComparison: FC<CanonicalComparisonProps> = ({
  projectId,
  subjectId,
}) => {
  const translate = useTranslate();
  const approved = useQuery(
    approvedCanonicalSetQueryOptions(projectId, subjectId),
  );
  const sets = useQuery(canonicalSetsQueryOptions(projectId, subjectId));

  if (approved.isPending || sets.isPending) {
    return null;
  }

  const approvedSet = approved.data ?? undefined;
  const draft = sets.data?.find(
    (set) => set.approvalState === APPROVAL_STATE.PENDING,
  );

  if (approvedSet === undefined && draft === undefined) {
    return null;
  }

  if (approvedSet === undefined || draft === undefined) {
    return (
      <section className="canonical-comparison">
        <h2 className="canonical-comparison__title">
          {translate('subjectReview.comparison.title')}
        </h2>
        <p className="canonical-comparison__note">
          {translate(
            approvedSet === undefined
              ? 'subjectReview.comparison.noApproved'
              : 'subjectReview.comparison.noDraft',
          )}
        </p>
      </section>
    );
  }

  return (
    <ComparisonPairs
      projectId={projectId}
      subjectId={subjectId}
      approvedSetId={approvedSet.id}
      draftSetId={draft.id}
    />
  );
};
