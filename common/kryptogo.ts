import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from "@rainbow-me/rainbowkit";
import { iconUrl } from "constants/icon";

export interface MyWalletOptions {
  projectId: string;
  chains: Chain[];
}

export const kryptogo = ({ projectId, chains }: MyWalletOptions): Wallet => ({
  id: "stickey-wallet",
  name: "Stickey Wallet",
  iconUrl: iconUrl,
  iconBackground: "#0c2f78",
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=app.stickey",
    ios: "https://apps.apple.com/us/app/stickey/id1671113083",
    qrCode: "https://stickey.app",
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({
      version: "2",
      projectId,
      chains,
    });
    return {
      connector,
      mobile: {
        getUri: async () => {
          const provider = await connector.getProvider();
          return new Promise<string>((resolve) =>
            provider.once("display_uri", (uri) => {
              uri = "stickyapp://wc?uri=" + encodeURIComponent(uri);
              resolve(uri);
            })
          );
        },
      },
      qrCode: {
        getUri: async () => {
          const provider = await connector.getProvider();
          return new Promise<string>((resolve) =>
            provider.once("display_uri", resolve)
          );
        },
        instructions: {
          learnMoreUrl: "https://stickey.app",
          steps: [
            {
              step: "install",
              title: "Open Stickey Wallet",
              description:
                "We recommend putting Stickey Wallet on your home screen for faster access to your wallet.",
            },
            {
              step: "create",
              title: "Create your wallet",
              description:
                "You can create a new wallet or import an existing wallet.",
            },
            {
              step: "scan",
              title: "Tap the scan button",
              description:
                "After you scan, a connection prompt will appear for you to connect your wallet.",
            },
          ],
        },
      },
    };
  },
});
