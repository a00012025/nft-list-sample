import { ConnectButton } from '@rainbow-me/rainbowkit';
import TokenGated from 'components/TokenGated';
import { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
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

const DemiOnlyPage: NextPage = () => {
  return (
    <TokenGated openseaSlug='demihuman'>
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
        <div>Congrats! You have at least one Demi Human!</div>
      </>
    </TokenGated>
  );
};

export default DemiOnlyPage;
