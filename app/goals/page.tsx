'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

interface Goal {
    id: string
    title: string
    description: string | null
    targetAmount: number
    currentAmount: number
    progressPercent: number
    daysRemaining: number | null
    deadline: string | null
    achievedMilestones: number
    totalMilestones: number
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchGoals()
    }, [])

    const fetchGoals = async () => {
        try {
            const response = await fetch('/api/goals')
            if (response.ok) {
                const data = await response.json()
                setGoals(data)
            }
        } catch (error) {
            console.error('Failed to fetch goals:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 py-12 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <Skeleton className="h-12 w-96 mx-auto mb-4" />
                        <Skeleton className="h-6 w-[600px] mx-auto" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardContent className="pt-6">
                                    <Skeleton className="h-6 w-full mb-2" />
                                    <Skeleton className="h-4 w-3/4 mb-4" />
                                    <Skeleton className="h-2 w-full mb-2" />
                                    <Skeleton className="h-8 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">🎯 Mục Tiêu Lì Xì Tết</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Cùng nhau gửi lì xì để Trừn có một năm mới thật hạnh phúc
                    </p>
                </div>

                {/* Goals Grid */}
                {goals.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <p className="text-gray-500 text-lg">Chưa có mục tiêu nào đang hoạt động</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map((goal) => (
                            <Card key={goal.id} className="hover:shadow-lg transition-all">
                                <CardContent className="pt-6">
                                    {/* Goal Header */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold mb-2">{goal.title}</h3>
                                        {goal.description && (
                                            <p className="text-gray-600 text-sm">{goal.description}</p>
                                        )}
                                    </div>

                                    {/* Progress Section */}
                                    <div className="space-y-3 mb-4">
                                        {/* Progress Bar */}
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <Badge variant="secondary" className="font-semibold">
                                                    {goal.progressPercent}%
                                                </Badge>
                                                {goal.daysRemaining !== null && (
                                                    <span className="text-gray-500 text-xs">
                                                        Còn {goal.daysRemaining} ngày
                                                    </span>
                                                )}
                                            </div>
                                            <Progress value={goal.progressPercent} className="h-2" />
                                        </div>

                                        {/* Amount */}
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-2xl font-bold text-primary">
                                                {goal.currentAmount.toLocaleString('vi-VN')}₫
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                / {goal.targetAmount.toLocaleString('vi-VN')}₫
                                            </span>
                                        </div>

                                        {/* Milestones */}
                                        {goal.totalMilestones > 0 && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600">Cột mốc:</span>
                                                <span className="font-semibold">
                                                    {goal.achievedMilestones}/{goal.totalMilestones}
                                                </span>
                                                <div className="flex gap-1">
                                                    {Array.from({ length: goal.totalMilestones }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-2 h-2 rounded-full ${i < goal.achievedMilestones
                                                                ? 'bg-success'
                                                                : 'bg-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA Button */}
                                    <Button asChild className="w-full rounded-full">
                                        <Link href={`/donate?goalId=${goal.id}`}>
                                            🧧 Gửi Lì Xì Ngay
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 max-w-2xl mx-auto">
                        <CardContent className="pt-6">
                            <h3 className="text-2xl font-bold mb-4">Chưa biết gửi lì xì cho mục tiêu nào?</h3>
                            <p className="text-gray-600 mb-6">
                                Bạn có thể gửi lì xì tự do và chúng tôi sẽ sử dụng vào mục tiêu cần thiết nhất
                            </p>
                            <Button asChild size="lg" className="rounded-full">
                                <Link href="/donate">🧧 Gửi Lì Xì Tự Do →</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
