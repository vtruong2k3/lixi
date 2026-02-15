/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Approve a donation (Admin only)
 * POST /api/admin/donations/[id]/approve
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params for Next.js 15+
        const { id: donationId } = await params


        // Check auth
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Find donation
        const donation = await prisma.donation.findUnique({
            where: { id: donationId },
            include: { transaction: true },
        })

        if (!donation) {
            return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
        }

        if (donation.status === 'COMPLETED') {
            return NextResponse.json(
                { error: 'Donation already approved' },
                { status: 400 }
            )
        }

        // Update donation and transaction
        await prisma.$transaction(async (tx: any) => {
            // Update donation
            await tx.donation.update({
                where: { id: donationId },
                data: { status: 'COMPLETED' },
            })

            // Update transaction
            if (donation.transaction) {
                await tx.transaction.update({
                    where: { id: donation.transaction.id },
                    data: {
                        status: 'COMPLETED',
                        ipnVerified: true,
                        metadata: {
                            ...(donation.transaction.metadata as object),
                            verifiedBy: session.user.id,
                            verifiedAt: new Date().toISOString(),
                        },
                    },
                })
            }

            // Create activity
            await tx.activity.create({
                data: {
                    type: 'DONATION',
                    content: donation.isAnonymous
                        ? `Một người ẩn danh đã quyên góp ${Number(donation.amount).toLocaleString('vi-VN')}₫`
                        : `${donation.donorName || 'Một người'} đã quyên góp ${Number(donation.amount).toLocaleString('vi-VN')}₫`,
                    metadata: {
                        donationId: donation.id,
                        amount: Number(donation.amount),
                    },
                },
            })

            // TODO: Send thank you email
        })

        return NextResponse.json({ success: true, message: 'Donation approved' })
    } catch (error) {
        console.error('Error approving donation:', error)
        return NextResponse.json(
            { error: 'Failed to approve donation' },
            { status: 500 }
        )
    }
}
