import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { unstable_getServerSession } from 'next-auth';
import { getAuthOptions } from './api/auth/[...nextauth]';
import Auth from '../components/Auth';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    getAuthOptions(context.req)
  );
  return {
    props: {
      session,
    },
  };
};

const NftPage: NextPage = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch('/api/nfts')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <Auth>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 12,
        }}
      >
        <ConnectButton
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
          chainStatus={{
            smallScreen: 'icon',
            largeScreen: 'full',
          }}
          showBalance={{
            smallScreen: true,
            largeScreen: false,
          }}
        />
      </div>
      {isLoading && <div>Loading...</div>}
      {!isLoading && data && (
        <div
          style={{
            padding: 12,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          }}
        >
          {data?.assets.map((nft: any) => (
            <div
              key={nft.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 12,
                border: '1px solid #ccc',
                borderRadius: 12,
                margin: 12,
                height: 300,
              }}
            >
              <Image
                alt={'NFT image'}
                src={nft.image_preview_url ?? nft.image_url}
                height={200}
                width={200}
                objectFit={'cover'}
                style={{
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              />
              <div>{nft.collection.name}</div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {nft.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </Auth>
  );
};

export default NftPage;
