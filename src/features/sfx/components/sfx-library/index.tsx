import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { sfxAssetsQueryOptions } from '@/features/sfx/api/sfx-assets.query';
import { ImportSfxAssetForm } from '@/features/sfx/components/import-sfx-asset-form';
import { SfxAssetCard } from '@/features/sfx/components/sfx-asset-card';
import { SFX_CARD_SKELETON_COUNT } from '@/features/sfx/sfx.constants';
import './sfx-library.css';

export const SfxLibrary: FC = () => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(sfxAssetsQueryOptions());
  const [isImportOpen, setIsImportOpen] = useState(false);

  if (error && data === undefined) {
    const view = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('sfx.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={2}
      />
    );
  }

  return (
    <div className="sfx-library">
      <div className="sfx-library__actions">
        <Button
          type="button"
          variant="primary"
          size="md"
          aria-expanded={isImportOpen}
          onClick={() => setIsImportOpen(true)}
        >
          {translate('sfx.import.open')}
        </Button>
      </div>

      {isImportOpen ? (
        <ImportSfxAssetForm onClose={() => setIsImportOpen(false)} />
      ) : null}

      {isPending ? (
        <>
          <output className="sfx-library__loading">
            {translate('sfx.loading')}
          </output>
          <ul className="sfx-library__list">
            {Array.from({ length: SFX_CARD_SKELETON_COUNT }, (_, index) => (
              <li className="sfx-library__placeholder" key={index}>
                <Skeleton shape="rect" />
              </li>
            ))}
          </ul>
        </>
      ) : data.items.length === 0 ? (
        <EmptyState
          title={translate('sfx.empty.title')}
          description={translate('sfx.empty.description')}
          headingLevel={2}
        />
      ) : (
        <ul className="sfx-library__list">
          {data.items.map((asset) => (
            <SfxAssetCard key={asset.id} asset={asset} />
          ))}
        </ul>
      )}

      {data?.nextCursor === undefined ? null : (
        <p className="sfx-library__truncated">{translate('sfx.truncated')}</p>
      )}
    </div>
  );
};
