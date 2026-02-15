import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * Get recent activities
 * GET /api/activities?limit=10
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '10', 10)

        const activities = await prisma.activity.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        })

        return NextResponse.json(activities)
    } catch (error) {
        console.error('Error fetching activities:', error)
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        )
    }
}
