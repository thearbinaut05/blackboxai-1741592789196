const { ethers } = require('ethers');
const config = require('./config');

class GasCoverageService {
    constructor() {
        this.config = config;
    }

    async coverGasCosts(transaction) {
        try {
            // Calculate gas costs
            const gasPrice = await this.provider.getGasPrice();
            const gasLimit = this.config.gas.maxGasLimit;
            const gasCost = gasPrice.mul(gasLimit);

            // Modify transaction to cover gas
            transaction.gasPrice = 0;
            transaction.maxFeePerGas = 0;
            transaction.maxPriorityFeePerGas = 0;

            // Add gas coverage metadata
            transaction.gasCovered = true;
            transaction.originalGasCost = gasCost;

            return transaction;
        } catch (error) {
            console.error('Error covering gas costs:', error);
            throw new Error('Failed to cover gas costs');
        }
    }

    async processWithdrawal(userAddress, amount) {
        try {
            // Create base transaction
            let transaction = {
                to: userAddress,
                value: amount,
                gasLimit: this.config.gas.maxGasLimit
            };

            // Apply gas coverage
            transaction = await this.coverGasCosts(transaction);

            // Return modified transaction
            return transaction;
        } catch (error) {
            console.error('Error processing withdrawal:', error);
            throw new Error('Failed to process withdrawal');
        }
    }

    // Validate transaction has gas coverage
    validateGasCoverage(transaction) {
        return (
            transaction.gasPrice === 0 &&
            transaction.maxFeePerGas === 0 &&
            transaction.maxPriorityFeePerGas === 0 &&
            transaction.gasCovered === true
        );
    }
}

module.exports = GasCoverageService;
