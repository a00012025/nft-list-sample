import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Need authentication or redirect to home page
export const useNeedAuth = (session: any) => {
  useEffect(() => {
    if (session?.status !== 'authenticated') {
      window.location.href = '/';
    }
  }, [session]);
};
