'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface Donation {
    id: string
    amount: number
    message: string | null
    donorName: string | null
    createdAt: string
    user: {
        name: string | null
    } | null
    type: {
        name: string
        icon: string | null
    } | null
}

export default function RecentActivities() {
    const [donations, setDonations] = useState<Donation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRecentDonations()
    }, [])

    const fetchRecentDonations = async () => {
        try {
            const response = await fetch('/api/donations?limit=10&status=COMPLETED')
            if (response.ok) {
                const data = await response.json()
                setDonations(data)
            }
        } catch (error) {
            console.error('Failed to fetch donations:', error)
        } finally {
            setLoading(false)
        }
    }

    const getDonorName = (donation: Donation) => {
        if (donation.donorName) return donation.donorName
        if (donation.user?.name) return donation.user.name
        return 'Người ủng hộ ẩn danh'
    }

    if (loading) {
        return (
            <section className="py-16 px-6 bg-gray-50">
                <div className="container mx-auto max-w-4xl text-center">
                    <p className="text-gray-500">Đang tải...</p>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 px-6 bg-gray-50">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-3xl font-bold text-center mb-12">
                    🧧 Những Lì Xì Gần Đây
                </h2>

                <div className="space-y-4">
                    {donations.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🧧</div>
                            <p className="text-gray-500">Chưa có lì xì nào</p>
                            <p className="text-sm text-gray-400 mt-2">Hãy là người đầu tiên gửi lì xì cho Trừn!</p>
                        </div>
                    ) : (
                        donations.map((donation) => (
                            <div
                                key={donation.id}
                                className="card flex items-start gap-4 hover:shadow-xl transition-shadow"
                            >
                                <div className="text-3xl">
                                    {donation.type?.icon || '🧧'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-semibold text-gray-800">
                                            {getDonorName(donation)}
                                        </p>
                                        <span className="text-lg font-bold text-primary">
                                            {donation.amount.toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                    {donation.message && (
                                        <p className="text-gray-600 text-sm italic mb-1">
                                            "{donation.message}"
                                        </p>
                                    )}
                                    {donation.type?.name && (
                                        <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mr-2">
                                            {donation.type.name}
                                        </span>
                                    )}
                                    <span className="text-sm text-gray-500">
                                        {formatDistanceToNow(new Date(donation.createdAt), {
                                            addSuffix: true,
                                            locale: vi,
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}
