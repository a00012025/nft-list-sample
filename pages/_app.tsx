import '../styles/global.css';
import type { AppProps } from 'next/app';

import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';

import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  connectorsForWallets,
  wallet,
  lightTheme,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from '@rainbow-me/rainbowkit-siwe-next-auth';
import { kryptogo } from '../common/kryptogo';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

const demoAppInfo = {
  appName: 'KryptoGO Wallet Demo',
};

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [kryptogo({ chains }), wallet.walletConnect({ chains })],
  },
  {
    groupName: 'Other',
    wallets: [
      wallet.metaMask({ chains }),
      wallet.rainbow({ chains }),
      wallet.trust({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to the KryptoGO + SIWE example app',
});

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider refetchInterval={0} session={pageProps.session}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider
            appInfo={demoAppInfo}
            chains={chains}
            initialChain={chain.mainnet}
            theme={{
              lightMode: lightTheme({
                accentColor: '#FFC211',
                accentColorForeground: '#001F58',
                borderRadius: 'large',
                fontStack: 'rounded',
                overlayBlur: 'none',
              }),
              darkMode: darkTheme({
                accentColor: '#FFC211',
                accentColorForeground: '#001F58',
                borderRadius: 'large',
                fontStack: 'rounded',
                overlayBlur: 'none',
              }),
            }}
            modalSize='compact'
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </WagmiConfig>
    </SessionProvider>
  );
}

export default App;
