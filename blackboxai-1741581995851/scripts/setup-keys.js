const ethers = require('ethers');
const crypto = require('crypto');

class KeyManager {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32;
    }

    // Generate secure keys for gas coverage
    async generateGasCoverageKeys() {
        try {
            // Generate random bytes for key
            const key = crypto.randomBytes(this.keyLength);
            
            // Create wallet for gas coverage
            const wallet = ethers.Wallet.createRandom();
            
            return {
                gasCoverageKey: key.toString('hex'),
                gasCoverageAddress: wallet.address,
                gasCoveragePrivateKey: wallet.privateKey
            };
        } catch (error) {
            console.error('Error generating gas coverage keys:', error);
            throw new Error('Failed to generate gas coverage keys');
        }
    }

    // Encrypt gas coverage keys
    async encryptGasCoverageKeys(keys, password) {
        try {
            const salt = crypto.randomBytes(16);
            const key = crypto.pbkdf2Sync(password, salt, 100000, this.keyLength, 'sha512');
            const iv = crypto.randomBytes(12);
            const cipher = crypto.createCipheriv(this.algorithm, key, iv);
            
            let encrypted = cipher.update(JSON.stringify(keys), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const authTag = cipher.getAuthTag();
            
            return {
                encrypted,
                iv: iv.toString('hex'),
                authTag: authTag.toString('hex'),
                salt: salt.toString('hex')
            };
        } catch (error) {
            console.error('Error encrypting gas coverage keys:', error);
            throw new Error('Failed to encrypt gas coverage keys');
        }
    }

    // Decrypt gas coverage keys
    async decryptGasCoverageKeys(encryptedData, password) {
        try {
            const salt = Buffer.from(encryptedData.salt, 'hex');
            const key = crypto.pbkdf2Sync(password, salt, 100000, this.keyLength, 'sha512');
            const iv = Buffer.from(encryptedData.iv, 'hex');
            const authTag = Buffer.from(encryptedData.authTag, 'hex');
            
            const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
            decipher.setAuthTag(authTag);
            
            let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Error decrypting gas coverage keys:', error);
            throw new Error('Failed to decrypt gas coverage keys');
        }
    }

    // Validate gas coverage keys
    validateGasCoverageKeys(keys) {
        return (
            keys.gasCoverageKey &&
            keys.gasCoverageAddress &&
            keys.gasCoveragePrivateKey &&
            ethers.utils.isHexString(keys.gasCoveragePrivateKey) &&
            ethers.utils.isAddress(keys.gasCoverageAddress)
        );
    }
}

module.exports = KeyManager;
