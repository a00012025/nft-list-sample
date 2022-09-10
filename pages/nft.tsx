import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { unstable_getServerSession } from 'next-auth';
import _ from 'lodash';
import { getAuthOptions } from './api/auth/[...nextauth]';
import Auth from 'components/Auth';
import useNfts from 'hooks/useNfts';
import { useRef, useState } from 'react';
import { isValidEthereumAddress } from 'utils/ethereum';

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
  const { nfts, loading, setContractAddress, setSlug } = useNfts();
  const [isContractError, setIsContractError] = useState(false);

  const searchContract = useRef(
    _.debounce((e) => {
      const contractAddress = e.target.value;
      if (contractAddress == '' || isValidEthereumAddress(contractAddress)) {
        setContractAddress(contractAddress);
        setIsContractError(false);
      } else {
        setIsContractError(true);
      }
    }, 500)
  ).current;
  const searchSlug = useRef(
    _.debounce((e) => {
      setSlug(e.target.value);
    }, 500)
  ).current;

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
      <input
        placeholder='Search Contract Address'
        style={{
          border: '1px solid #ccc',
          borderColor: isContractError ? 'red' : '#ccc',
          borderRadius: 4,
          fontSize: 16,
          padding: 8,
          width: '100%',
        }}
        onChange={searchContract}
      />
      <div style={{ height: 12 }} />
      <input
        placeholder='Search Slug'
        style={{
          border: '1px solid #ccc',
          borderRadius: 4,
          fontSize: 16,
          padding: 8,
          width: '100%',
        }}
        onChange={searchSlug}
      />
      {isContractError && (
        <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
          Please enter a valid contract address
        </div>
      )}

      {loading && <div>Loading...</div>}
      {!loading && nfts.length === 0 && <div>No NFTs found</div>}
      {!loading && nfts && (
        <div
          style={{
            padding: 12,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          }}
        >
          {nfts.map((nft) => (
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
                src={nft.image}
                height={200}
                width={200}
                objectFit={'cover'}
                style={{
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              />
              <div>{nft.collectionName}</div>
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
