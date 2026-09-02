import type { FC } from 'react';
import { ContentText } from '@/lib/components/content-text';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { styleVersionDiff } from '@/features/styles/helpers/style-version-diff';
import type { StyleDiffField } from '@/features/styles/helpers/style-version-diff';
import type { StyleVersionDiffProps } from './style-version-diff.interface';
import './style-version-diff.css';

const FIELD_LABEL: Record<StyleDiffField, TranslationKey> = {
  name: 'library.field.name',
  mode: 'library.field.mode',
  description: 'library.field.description',
  realismLevel: 'library.field.realismLevel',
  referenceAssetIds: 'styles.diff.referenceAssetIds',
  paletteRules: 'library.field.paletteRules',
  lightingRules: 'library.field.lightingRules',
  cameraRules: 'library.field.cameraRules',
  textureRules: 'library.field.textureRules',
  motionRules: 'library.field.motionRules',
  prohibitedStyleDrift: 'library.field.prohibitedStyleDrift',
  imageGenerationDefaults: 'styles.diff.imageGenerationDefaults',
  videoGenerationDefaults: 'styles.diff.videoGenerationDefaults',
};

export const StyleVersionDiff: FC<StyleVersionDiffProps> = ({
  previous,
  current,
}) => {
  const translate = useTranslate();
  const changes = styleVersionDiff(previous, current);
  const version = String(previous.version);

  return (
    <details className="style-version-diff">
      <summary className="style-version-diff__summary">
        {translate('styles.diff.summary', { version })}
      </summary>
      {changes.length === 0 ? (
        <p className="style-version-diff__none">
          {translate('styles.diff.none', { version })}
        </p>
      ) : (
        <dl className="style-version-diff__fields">
          {changes.map((change) => (
            <div className="style-version-diff__field" key={change.field}>
              <dt className="style-version-diff__label">
                {translate(FIELD_LABEL[change.field])}
              </dt>
              <dd className="style-version-diff__lines">
                <ul className="style-version-diff__list">
                  {change.removed.map((line) => (
                    <li
                      className="style-version-diff__line"
                      data-change="removed"
                      key={`removed:${line}`}
                    >
                      <span className="style-version-diff__mark">
                        {translate('styles.diff.removed')}
                      </span>{' '}
                      <ContentText>{line}</ContentText>
                    </li>
                  ))}
                  {change.added.map((line) => (
                    <li
                      className="style-version-diff__line"
                      data-change="added"
                      key={`added:${line}`}
                    >
                      <span className="style-version-diff__mark">
                        {translate('styles.diff.added')}
                      </span>{' '}
                      <ContentText>{line}</ContentText>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </details>
  );
};
