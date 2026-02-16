'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Goal {
    id: string
    title: string
    description: string
    targetAmount: number
    currentAmount: number
    progressPercent: number
    daysRemaining: number | null
    deadline: string | null
}

export default function HeroSection() {
    const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCurrentGoal()
    }, [])

    const fetchCurrentGoal = async () => {
        try {
            const response = await fetch('/api/goals')
            if (response.ok) {
                const goals = await response.json()
                if (goals.length > 0) {
                    setCurrentGoal(goals[0]) // Get first active goal
                }
            }
        } catch (error) {
            console.error('Failed to fetch goal:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="relative bg-gradient-to-br from-primary-light via-primary to-secondary text-white py-20 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Text Content */}
                    <div className="space-y-6">
                        <div className="inline-block">
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                                🧧 Mừng Xuân Ất Tỵ 2025
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            Gửi Lì Xì<br />
                            <span className="text-accent">Nhận Phúc Lộc</span>
                        </h1>

                        <p className="text-xl text-white/90 leading-relaxed">
                            Năm mới Bính Ngọ, cùng chúc Trừn một năm an khang thịnh vượng.
                            Mỗi phong bao lì xì đều mang theo lời chúc may mắn và phúc lộc.
                        </p>

                        {/* Current Goal Progress */}
                        {!loading && currentGoal && (
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-lg">
                                        {currentGoal.title}
                                    </span>
                                    {currentGoal.daysRemaining !== null && (
                                        <span className="bg-accent text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Còn {currentGoal.daysRemaining} ngày
                                        </span>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="progress-bar bg-white/20">
                                        <div
                                            className="progress-fill bg-gradient-to-r from-accent to-white"
                                            style={{ width: `${currentGoal.progressPercent}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-lg">
                                            {currentGoal.currentAmount.toLocaleString('vi-VN')}₫
                                        </span>
                                        <span className="text-white/80">
                                            / {currentGoal.targetAmount.toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-3xl font-bold">{currentGoal.progressPercent}%</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href="/donate"
                                className="btn btn-primary bg-white text-primary hover:bg-white/90 shadow-xl"
                            >
                                🧧 Gửi Lì Xì Ngay
                            </Link>
                            <Link
                                href="/goals"
                                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary"
                            >
                                Xem Mục Tiêu
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                            {/* Placeholder for Trun's photo */}
                            <div className="aspect-square bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center">
                                <div className="text-center space-y-4 p-8">
                                    <div className="text-8xl">🐾</div>
                                    <p className="text-2xl font-bold">Trừn</p>
                                    <p className="text-white/80">Chúc bạn năm mới vạn sự như ý</p>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 bg-accent text-gray-800 px-4 py-2 rounded-full font-bold shadow-lg">
                                ❤️ Loved
                            </div>
                        </div>

                        {/* Floating stats cards */}
                        <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 rounded-2xl p-4 shadow-xl">
                            <div className="text-3xl font-bold text-primary">100+</div>
                            <div className="text-sm text-gray-600">Phong Bao Lì Xì</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </section>
    )
}
