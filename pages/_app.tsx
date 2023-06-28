import "styles/global.css";
import type { AppProps } from "next/app";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, goerli, mainnet, optimism, polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { SessionProvider } from "next-auth/react";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  connectorsForWallets,
  lightTheme,
  darkTheme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
// import {
//   metaMaskWallet
// } from "@rainbow-me/rainbowkit-wallets";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { kryptogo } from "common/kryptogo";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
    publicProvider(),
  ]
);

const demoAppInfo = {
  appName: "KryptoGO Wallet NFT Demo",
};

const projectId = "8915b4a2b51ba9c555cfd42bbf247cc9";

const { wallets } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId,
  chains,
});

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      kryptogo({ projectId, chains }),
      // metaMaskWallet({ chains }),
      // , wallet.walletConnect({ chains })
    ],
  },
  ...wallets,
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to the KryptoGO + SIWE example app",
});

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider refetchInterval={0} session={pageProps.session}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider
            appInfo={demoAppInfo}
            chains={chains}
            initialChain={mainnet}
            // openseaApiKey={process.env.NEXT_PUBLIC_OPENSEA_API_KEY}
            theme={{
              lightMode: lightTheme({
                accentColor: "#FFC211",
                accentColorForeground: "#001F58",
                borderRadius: "large",
                fontStack: "rounded",
                overlayBlur: "none",
              }),
              darkMode: darkTheme({
                accentColor: "#FFC211",
                accentColorForeground: "#001F58",
                borderRadius: "large",
                fontStack: "rounded",
                overlayBlur: "none",
              }),
            }}
            modalSize="compact"
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </WagmiConfig>
    </SessionProvider>
  );
}

export default App;
