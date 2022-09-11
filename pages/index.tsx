import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getAuthOptions } from './api/auth/[...nextauth]';

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

const Home: NextPage = () => {
  const account = useAccount();
  const session = useSession();

  const [connected, setConnected] = useState(false);
  useEffect(() => {
    setConnected(account.status == 'connected' && account.address != '');
  }, [account]);

  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    setAuthenticated(session.status == 'authenticated');
  }, [session]);

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
          label={connected ? 'Verify' : 'Connect'}
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

      {!connected ? (
        <div>You are not connected</div>
      ) : (
        <div>You are connected with {account.address}</div>
      )}

      <br />

      {!authenticated ? (
        <div>Please verify your account</div>
      ) : (
        <>
          <div>Congrats! You are authenticated!</div>
          <div>Now you can access the secret NFT page:</div>
          <Link href={'/nft'}>GO</Link>

          <div>
            If you own at least one Demi Human, you can access this secret Demi
            page:
          </div>
          <Link href={'/demi-only'}>GO DEMI</Link>
        </>
      )}
    </>
  );
};

export default Home;
