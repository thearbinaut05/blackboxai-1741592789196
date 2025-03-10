module.exports = {
    // Network configuration
    network: {
        chainId: 1,
        name: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/your-project-id'
    },

    // DeFi Trading Configuration
    defi: {
        // Flash Loan Settings
        flashLoan: {
            providers: {
                aave: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
                dydx: '0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e'
            },
            minProfitThreshold: '0.1', // ETH
            maxLoanAmount: '1000', // ETH
        },

        // DEX Settings
        dex: {
            uniswap: {
                router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
                factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
            },
            sushiswap: {
                router: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
                factory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac'
            }
        },

        // Trading Pairs
        pairs: [
            {
                tokens: ['WETH', 'USDC'],
                addresses: {
                    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                }
            },
            {
                tokens: ['WBTC', 'USDC'],
                addresses: {
                    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
                    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                }
            }
        ],

        // Leverage Settings
        leverage: {
            maxLeverageRatio: 3,
            targetHealthFactor: 1.5,
            rebalanceThreshold: 1.3
        },

        // Trading Strategy
        strategy: {
            minProfitMargin: 0.005, // 0.5%
            maxSlippage: 0.003, // 0.3%
            gasMultiplier: 1.2, // 20% buffer for gas price
            retryAttempts: 3,
            tradingInterval: 1000 // 1 second
        },

        // Risk Management
        riskManagement: {
            maxPositionSize: '100', // ETH
            stopLossPercentage: 0.05, // 5%
            takeProfitPercentage: 0.1 // 10%
        }
    },

    // Gas Coverage Configuration
    gas: {
        coverGasCosts: true,
        maxGasLimit: 21000,
        priorityFee: 0,
        maxFeePerGas: 0
    }
};
