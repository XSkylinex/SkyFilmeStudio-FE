import type { FC } from 'react';
import { ContentText } from '@/lib/components/content-text';
import { useTranslate } from '@/lib/i18n/use-translate';
import { TraitList } from '@/features/subjects/components/trait-list';
import type { SubjectIdentityProps } from './subject-identity.interface';
import './subject-identity.css';

export const SubjectIdentity: FC<SubjectIdentityProps> = ({ subject }) => {
  const translate = useTranslate();
  const none = translate('subjectReview.identity.none');

  return (
    <section className="subject-identity">
      <h2 className="subject-identity__title">
        {translate('subjectReview.identity.title')}
      </h2>

      {subject.canonicalDescription ? (
        <p className="subject-identity__description">
          <ContentText>{subject.canonicalDescription}</ContentText>
        </p>
      ) : null}

      <TraitList
        label={translate('subjectReview.identity.immutable')}
        emptyLabel={none}
        traits={subject.immutableTraits}
        emphasis
      />
      <TraitList
        label={translate('subjectReview.identity.prohibited')}
        emptyLabel={none}
        traits={subject.prohibitedChanges}
        emphasis
      />
      <TraitList
        label={translate('subjectReview.identity.mutable')}
        emptyLabel={none}
        traits={subject.mutableTraits}
      />
      <TraitList
        label={translate('subjectReview.identity.wardrobe')}
        emptyLabel={none}
        traits={subject.wardrobeOrSurfaceRules}
      />
      <TraitList
        label={translate('subjectReview.identity.palette')}
        emptyLabel={none}
        traits={subject.colorPalette}
      />

      {subject.relativeScale ? (
        <p className="subject-identity__fact">
          {translate('subjectReview.identity.scale')}{' '}
          <ContentText>{subject.relativeScale}</ContentText>
        </p>
      ) : null}
      {subject.speechStyle ? (
        <p className="subject-identity__fact">
          {translate('subjectReview.identity.speech')}{' '}
          <ContentText>{subject.speechStyle}</ContentText>
        </p>
      ) : null}
    </section>
  );
};
