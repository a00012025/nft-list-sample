import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from '@rainbow-me/rainbowkit';
import { iconUrl } from '../constants/icon';

export interface MyWalletOptions {
  chains: Chain[];
}

export const kryptogo = ({ chains }: MyWalletOptions): Wallet => ({
  id: 'kryptogo-wallet',
  name: 'KryptoGO Wallet',
  iconUrl: iconUrl,
  iconBackground: '#0c2f78',
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=com.kryptogo.walletapp',
    ios: 'https://apps.apple.com/app/kryptogo/id1593830910',
    qrCode: 'https://kryptogo.page.link/download',
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({ chains });
    return {
      connector,
      mobile: {
        getUri: async () => {
          const { uri } = (await connector.getProvider()).connector;
          return 'https://kryptogo.page.link/wc?uri=' + encodeURIComponent(uri);
        },
      },
      qrCode: {
        getUri: async () => {
          const { uri } = (await connector.getProvider()).connector;
          return uri;
        },
        instructions: {
          learnMoreUrl: 'https://www.kryptogo.com/products/wallet',
          steps: [
            {
              step: 'install',
              title: 'Open KryptoGO Wallet',
              description:
                'We recommend putting KryptoGO Wallet on your home screen for faster access to your wallet.',
            },
            {
              step: 'create',
              title: 'Create your wallet',
              description:
                'You can create a new wallet or import an existing wallet.',
            },
            {
              step: 'scan',
              title: 'Tap the scan button',
              description:
                'After you scan, a connection prompt will appear for you to connect your wallet.',
            },
          ],
        },
      },
    };
  },
});
