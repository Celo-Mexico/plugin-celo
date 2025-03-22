export * from "./actions/swap";
export * from "./actions/transfer";
export * from "./actions/mento";
export * from "./providers/wallet";
export * from "./types/index";

import type { Plugin } from "@elizaos/core";
import { swapAction } from "./actions/swap";
import { transferAction } from "./actions/transfer";
import { mentoAction } from "./actions/mento";
import { evmWalletProvider } from "./providers/wallet";

export const celoPlugin: Plugin = {
    name: "celo",
    description: "Celo blockchain integration plugin",
    providers: [evmWalletProvider],
    evaluators: [],
    services: [],
    actions: [transferAction, swapAction, mentoAction],
};

export default celoPlugin;
