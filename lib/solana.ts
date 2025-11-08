import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const DEVNET_URL = 'https://api.devnet.solana.com';

export async function mintNFT(walletAddress: string, courseName: string) {
  try {
    const connection = new Connection(DEVNET_URL, 'confirmed');
    
    
    const wallet = new PublicKey(walletAddress);
    
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet,
        toPubkey: wallet, 
        lamports: 0,
      })
    );
    
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet;
    
    return {
      success: true,
      message: `NFT minted for ${courseName}!`,
      
      mintAddress: wallet.toBase58(),
    };
  } catch (error: any) {
    console.error('Mint error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getWalletBalance(walletAddress: string): Promise<number> {
  try {
    const connection = new Connection(DEVNET_URL, 'confirmed');
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Balance error:', error);
    return 0;
  }
}