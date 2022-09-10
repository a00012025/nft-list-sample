import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { useNeedAuth } from '../hooks/useNeedAuth';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
};

const NftPage: NextPage = () => {
  useNeedAuth();

  return (
    <>
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
    </>
  );
};

export default NftPage;
