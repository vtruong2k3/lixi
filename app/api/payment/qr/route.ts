import { NextRequest, NextResponse } from 'next/server'
import { generateVietQR } from '@/lib/payment/vietqr'
import { prisma } from '@/lib/prisma'

/**
 * API endpoint to generate QR code for bank transfer
 * GET /api/payment/qr?donationId=xxx
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const donationId = searchParams.get('donationId')

        if (!donationId) {
            return NextResponse.json(
                { error: 'donationId is required' },
                { status: 400 }
            )
        }

        // Find donation
        const donation = await prisma.donation.findUnique({
            where: { id: donationId },
        })

        if (!donation) {
            return NextResponse.json(
                { error: 'Donation not found' },
                { status: 404 }
            )
        }

        // Generate QR code
        const qrUrl = await generateVietQR({
            bankCode: process.env.BANK_CODE || 'MB',
            accountNo: process.env.BANK_ACCOUNT_NO || '',
            accountName: process.env.BANK_ACCOUNT_NAME || 'TRUN COMMUNITY',
            amount: Number(donation.amount),
            description: `TRUN ${donationId.slice(0, 8)}`,
            template: 'compact',
        })

        // Return QR info
        return NextResponse.json({
            qrUrl,
            bankInfo: {
                bankCode: process.env.BANK_CODE,
                accountNo: process.env.BANK_ACCOUNT_NO,
                accountName: process.env.BANK_ACCOUNT_NAME,
                amount: donation.amount.toString(),
                content: `TRUN ${donationId.slice(0, 8)}`,
            },
        })
    } catch (error) {
        console.error('QR generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate QR code' },
            { status: 500 }
        )
    }
}
