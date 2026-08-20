import type { FC } from 'react';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import type { FatalErrorViewProps } from './fatal-error-view.interface';

const handleReload = (): void => {
  window.location.reload();
};

export const FatalErrorView: FC<FatalErrorViewProps> = ({
  detail,
  description,
}) => {
  const translate = useTranslate();

  return (
    <div className="fatal-boundary">
      <ErrorState
        title={translate('error.fatalTitle')}
        description={description ?? translate('error.fatalDescription')}
        detail={detail}
        action={
          <Button variant="primary" size="md" onClick={handleReload}>
            {translate('error.reload')}
          </Button>
        }
      />
    </div>
  );
};
