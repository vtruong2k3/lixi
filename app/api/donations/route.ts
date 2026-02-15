import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createDonationSchema = z.object({
    amount: z.number().positive().min(1000, 'Số tiền tối thiểu là 1,000₫'),
    message: z.string().nullish(),
    isAnonymous: z.boolean().default(false),
    donorName: z.string().nullish(),
    donorEmail: z.string().email().nullish().or(z.literal('')).nullish(),
    donorPhone: z.string().nullish(),
    typeId: z.string().nullish(),
    goalId: z.string().nullish(),
})


/**
 * Create a new donation
 * POST /api/donations/create
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validatedData = createDonationSchema.parse(body)

        // Create donation record
        const donation = await prisma.donation.create({
            data: {
                amount: validatedData.amount,
                message: validatedData.message,
                isAnonymous: validatedData.isAnonymous,
                donorName: validatedData.donorName,
                donorEmail: validatedData.donorEmail,
                donorPhone: validatedData.donorPhone,
                status: 'PENDING',
                typeId: validatedData.typeId,
                goalId: validatedData.goalId,
            },
        })

        // Create transaction record
        await prisma.transaction.create({
            data: {
                donationId: donation.id,
                provider: 'BANK_TRANSFER',
                amount: validatedData.amount,
                status: 'PENDING',
            },
        })

        return NextResponse.json({
            success: true,
            donationId: donation.id,
            redirectUrl: `/donate/payment/${donation.id}`,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.issues },
                { status: 400 }
            )
        }

        console.error('Error creating donation:', error)
        return NextResponse.json(
            { error: 'Failed to create donation' },
            { status: 500 }
        )
    }
}

/**
 * Get donation types
 * GET /api/donations/types
 */
export async function GET() {
    try {
        const types = await prisma.donationType.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                suggestedAmount: 'asc',
            },
        })

        return NextResponse.json(types)
    } catch (error) {
        console.error('Error fetching donation types:', error)
        return NextResponse.json(
            { error: 'Failed to fetch donation types' },
            { status: 500 }
        )
    }
}
