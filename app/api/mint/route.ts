import { NextRequest, NextResponse } from 'next/server';
import { mintNFT } from '@/lib/solana';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, courseName, topic } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address required' },
        { status: 400 }
      );
    }

    const result = await mintNFT(walletAddress, courseName || topic || 'General Learning');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Mint API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}