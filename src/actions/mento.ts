import {
    type IAgentRuntime,
    type Memory,
    type State,
    elizaLogger,
    composeContext,
    generateObjectDeprecated,
    ModelClass,
} from "@elizaos/core";
import {
    type Address,
    type ByteArray,
    type Hex,
    parseUnits,
    formatUnits,
    parseAbi,
} from "viem";

import { initWalletProvider, type WalletProvider } from "../providers/wallet";
import { mentoTemplate } from "../templates";
import type {
    MentoParams,
    MentoQuoteResult,
    Transaction,
} from "../types";

export { mentoTemplate };

export class MentoAction {
    constructor(private walletProvider: WalletProvider) {
        this.walletProvider = walletProvider;
    }

    /**
     * Main handler for Mento operations
     */
    async execute(params: MentoParams): Promise<MentoQuoteResult | Transaction> {
        if (!["celo", "alfajores"].includes(params.chain.toLowerCase())) {
            throw new Error("Unsupported chain. Use only 'celo' or 'alfajores'.");
        }

        // Switch to the correct chain
        this.walletProvider.switchChain(params.chain);
        
        // Call the appropriate method based on operation type
        switch (params.operation) {
            case "quote":
                return this.getQuote(params);
            case "approve":
                return this.increaseTradingAllowance(params);
            case "swap":
                return this.swap(params);
            default:
                throw new Error(`Unsupported operation: ${params.operation}`);
        }
    }

    /**
     * Get quote for token swap
     */
    private async getQuote(params: MentoParams): Promise<MentoQuoteResult> {
        try {
            // For now, we'll implement a placeholder since we don't have the actual SDK
            // This would be replaced with actual SDK code once it's installed
            elizaLogger.log(`Getting quote for ${params.amount} ${params.fromToken} to ${params.toToken}`);
            
            // Mock implementation - will be replaced with actual SDK call
            const fromTokenDecimals = await this.getTokenDecimals(params.fromToken, params.chain);
            const toTokenDecimals = await this.getTokenDecimals(params.toToken, params.chain);
            
            const fromAmount = parseUnits(params.amount, fromTokenDecimals);
            // Mock exchange rate (1:1 for now)
            const toAmount = fromAmount;
            const minToAmount = toAmount * BigInt(Math.floor((100 - params.slippage) * 100)) / BigInt(10000);
            
            return {
                fromAmount,
                toAmount,
                minToAmount,
                fromToken: params.fromToken,
                toToken: params.toToken
            } as MentoQuoteResult;
            
            /* With SDK, it would be something like:
            const mento = await Mento.create(this.walletProvider.getWalletClient(params.chain));
            const fromAmount = parseUnits(params.amount, fromTokenDecimals);
            const quoteAmountOut = await mento.getAmountOut(
                params.fromToken,
                params.toToken,
                fromAmount
            );
            const minToAmount = quoteAmountOut.mul(100 - params.slippage).div(100);
            
            return {
                fromAmount,
                toAmount: quoteAmountOut,
                minToAmount,
                fromToken: params.fromToken,
                toToken: params.toToken
            };
            */
        } catch (error) {
            elizaLogger.error("Error in getQuote:", error.message);
            throw new Error(`Failed to get quote: ${error.message}`);
        }
    }

    /**
     * Increase token allowance for Mento contract
     */
    private async increaseTradingAllowance(params: MentoParams): Promise<Transaction> {
        try {
            // Mock implementation - will be replaced with actual SDK call
            elizaLogger.log(`Increasing allowance for ${params.amount} ${params.fromToken}`);
            
            const fromTokenDecimals = await this.getTokenDecimals(params.fromToken, params.chain);
            const walletClient = this.walletProvider.getWalletClient(params.chain);
            const [fromAddress] = await walletClient.getAddresses();
            
            // Mock Mento contract address (this would come from the SDK)
            const mentoContractAddress = "0x1111111111111111111111111111111111111111" as Address;
            
            // Encode approve function call
            const approveData = "0x095ea7b3000000000000000000000000111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000ff" as Hex;
            
            const hash = await walletClient.sendTransaction({
                account: walletClient.account,
                to: params.fromToken,
                value: BigInt(0),
                data: approveData,
                kzg: {
                    blobToKzgCommitment: (_: ByteArray): ByteArray => {
                        throw new Error("Function not implemented.");
                    },
                    computeBlobKzgProof: (
                        _blob: ByteArray,
                        _commitment: ByteArray
                    ): ByteArray => {
                        throw new Error("Function not implemented.");
                    },
                },
                chain: undefined,
            });
            
            return {
                hash,
                from: fromAddress,
                to: params.fromToken,
                value: BigInt(0),
                data: approveData,
            };
            
            /* With SDK, it would be something like:
            const mento = await Mento.create(this.walletProvider.getWalletClient(params.chain));
            const fromAmount = parseUnits(params.amount, fromTokenDecimals);
            const tx = await mento.increaseTradingAllowance(params.fromToken, fromAmount);
            
            return {
                hash: tx.hash,
                from: fromAddress,
                to: params.fromToken,
                value: BigInt(0),
                data: tx.data,
            };
            */
        } catch (error) {
            elizaLogger.error("Error in increaseTradingAllowance:", error.message);
            throw new Error(`Failed to increase trading allowance: ${error.message}`);
        }
    }

    /**
     * Execute token swap
     */
    private async swap(params: MentoParams): Promise<Transaction> {
        try {
            // First get a quote
            const quote = await this.getQuote(params);
            
            // Mock implementation - will be replaced with actual SDK call
            elizaLogger.log(`Swapping ${params.amount} ${params.fromToken} to ${params.toToken}`);
            
            const walletClient = this.walletProvider.getWalletClient(params.chain);
            const [fromAddress] = await walletClient.getAddresses();
            
            // Mock Mento contract address (this would come from the SDK)
            const mentoContractAddress = "0x1111111111111111111111111111111111111111" as Address;
            
            // Mock swap function call
            const swapData = "0x12345678000000000000000000000000111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000ff" as Hex;
            
            const hash = await walletClient.sendTransaction({
                account: walletClient.account,
                to: mentoContractAddress,
                value: BigInt(0),
                data: swapData,
                kzg: {
                    blobToKzgCommitment: (_: ByteArray): ByteArray => {
                        throw new Error("Function not implemented.");
                    },
                    computeBlobKzgProof: (
                        _blob: ByteArray,
                        _commitment: ByteArray
                    ): ByteArray => {
                        throw new Error("Function not implemented.");
                    },
                },
                chain: undefined,
            });
            
            return {
                hash,
                from: fromAddress,
                to: mentoContractAddress,
                value: BigInt(0),
                data: swapData,
            };
            
            /* With SDK, it would be something like:
            const mento = await Mento.create(this.walletProvider.getWalletClient(params.chain));
            const tx = await mento.swapIn(
                params.fromToken,
                params.toToken,
                quote.fromAmount,
                quote.minToAmount
            );
            
            return {
                hash: tx.hash,
                from: fromAddress,
                to: mentoContractAddress,
                value: BigInt(0),
                data: tx.data,
            };
            */
        } catch (error) {
            elizaLogger.error("Error in swap:", error.message);
            throw new Error(`Failed to execute swap: ${error.message}`);
        }
    }

    /**
     * Helper to get token decimals
     */
    private async getTokenDecimals(tokenAddress: Address, chain: string): Promise<number> {
        try {
            const decimalsAbi = parseAbi([
                "function decimals() view returns (uint8)",
            ]);

            const result = await this.walletProvider
                .getPublicClient(chain)
                .readContract({
                    address: tokenAddress,
                    abi: decimalsAbi,
                    functionName: "decimals",
                });

            return result as number;
        } catch (error) {
            elizaLogger.error("Error getting token decimals:", error.message);
            return 18; // Default to 18 decimals
        }
    }
}

/**
 * Export Mento action for ElizaOS
 */
export const mentoAction = {
    name: "mento",
    description: "Execute operations on the Mento Protocol on Celo",
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: any,
        callback?: any
    ) => {
        elizaLogger.log("Mento action handler called");
        const walletProvider = await initWalletProvider(runtime);
        const action = new MentoAction(walletProvider);

        // Compose Mento context
        const mentoContext = composeContext({
            state,
            template: mentoTemplate,
        });
        
        const content = await generateObjectDeprecated({
            runtime,
            context: mentoContext,
            modelClass: ModelClass.LARGE,
        }) as MentoParams;

        try {
            let responseText = "";
            
            switch (content.operation) {
                case "quote": {
                    const result = await action.execute(content) as MentoQuoteResult;
                    responseText = `Quote for ${content.amount} ${content.fromToken}:\n` +
                        `Expected output: ${formatUnits(result.toAmount, 18)} ${content.toToken}\n` + 
                        `Minimum output (with ${content.slippage}% slippage): ${formatUnits(result.minToAmount, 18)} ${content.toToken}`;
                    break;
                }
                    
                case "approve": {
                    const result = await action.execute(content) as Transaction;
                    responseText = `Successfully approved ${content.amount} ${content.fromToken} for Mento protocol\n` +
                        `Transaction Hash: ${result.hash}`;
                    break;
                }
                    
                case "swap": {
                    const result = await action.execute(content) as Transaction;
                    responseText = `Successfully swapped ${content.amount} ${content.fromToken} for ${content.toToken}\n` +
                        `Transaction Hash: ${result.hash}`;
                    break;
                }
            }

            if (callback) {
                callback({
                    text: responseText,
                    content: {
                        success: true,
                        operation: content.operation,
                        chain: content.chain,
                    },
                });
            }
            
            return true;
        } catch (error) {
            elizaLogger.error("Error in mento handler:", error.message);
            if (callback) {
                callback({ 
                    text: `Error: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: mentoTemplate,
    validate: async (runtime: IAgentRuntime) => {
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY");
        return typeof privateKey === "string" && privateKey.startsWith("0x");
    },
    examples: [
        [
            {
                user: "user",
                content: {
                    text: "Get a quote for swapping 1 CELO to cUSD on Mento",
                    action: "MENTO_OPERATION",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "Approve 5 CELO for trading on Mento",
                    action: "MENTO_OPERATION",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "Swap 2 CELO for cUSD using Mento protocol with 0.5% slippage",
                    action: "MENTO_OPERATION",
                },
            },
        ],
    ],
    similes: ["MENTO_OPERATION", "MENTO_SWAP", "MENTO_QUOTE", "MENTO_APPROVE"],
};