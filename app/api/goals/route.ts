import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * Get current active goals with progress
 * GET /api/goals
 */
export async function GET() {
    try {
        const goals = await prisma.goal.findMany({
            where: {
                status: 'ACTIVE', // Only ACTIVE goals
                deletedAt: null
            },
            include: {
                milestones: {
                    orderBy: {
                        amount: 'asc'
                    }
                }
            },
            orderBy: {
                deadline: 'asc'
            }
        })

        // Calculate progress for each goal
        const goalsWithProgress = await Promise.all(
            goals.map(async (goal: (typeof goals)[number]) => {
                // Sum all completed donations for this goal
                const donations = await prisma.donation.findMany({
                    where: {
                        goalId: goal.id,
                        status: 'COMPLETED',
                        deletedAt: null
                    }
                })

                const currentAmount = donations.reduce(
                    (sum: number, donation: (typeof donations)[number]) => sum + Number(donation.amount),
                    0
                )

                const progressPercent = Math.min(
                    Math.round((currentAmount / Number(goal.targetAmount)) * 100),
                    100
                )

                // Check milestone achievements
                const achievedMilestones = goal.milestones.filter(
                    (m: (typeof goal.milestones)[number]) => currentAmount >= Number(m.amount) && !m.achieved
                )

                return {
                    ...goal,
                    currentAmount,
                    progressPercent,
                    achievedMilestones: achievedMilestones.length,
                    totalMilestones: goal.milestones.length,
                    daysRemaining: goal.deadline
                        ? Math.max(
                            0,
                            Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                        )
                        : null
                }
            })
        )

        return NextResponse.json(goalsWithProgress)
    } catch (error) {
        console.error('Error fetching goals:', error)
        return NextResponse.json(
            { error: 'Failed to fetch goals' },
            { status: 500 }
        )
    }
}
