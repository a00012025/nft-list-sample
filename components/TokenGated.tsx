import { useSession } from 'next-auth/react';
import useNfts from 'hooks/useNfts';
import Auth from 'components/Auth';

export interface TokenGatedProps {
  children: React.ReactNode;
  contractAddress?: string | undefined;
  openseaSlug?: string | undefined;
}

const TokenGated = ({
  children,
  contractAddress,
  openseaSlug,
}: TokenGatedProps): JSX.Element => {
  const { nfts, loading } = useNfts({
    contractAddress,
    slug: openseaSlug,
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (nfts.length === 0) {
    return <div>{"You don't have permission to view this page"}</div>;
  }

  return <Auth>{children}</Auth>;
};

export default TokenGated;
