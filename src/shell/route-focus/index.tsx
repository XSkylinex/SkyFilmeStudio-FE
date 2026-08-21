import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { focusMainRegion } from '@/shell/helpers/focus-main-region';

export const RouteFocus: FC = () => {
  const { pathname } = useLocation();
  const settledPathname = useRef(pathname);

  useEffect(() => {
    if (settledPathname.current !== pathname) {
      settledPathname.current = pathname;
      focusMainRegion();
    }
  }, [pathname]);

  return null;
};
