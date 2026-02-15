'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface DonationType {
    id: string
    name: string
    suggestedAmount: number
    description: string | null
    icon: string | null
}

export default function DonatePage() {
    const router = useRouter()
    const [donationTypes, setDonationTypes] = useState<DonationType[]>([])
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [customAmount, setCustomAmount] = useState('')
    const [message, setMessage] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [donorName, setDonorName] = useState('')
    const [donorEmail, setDonorEmail] = useState('')
    const [donorPhone, setDonorPhone] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchDonationTypes()
    }, [])

    const fetchDonationTypes = async () => {
        try {
            const response = await fetch('/api/donations')
            if (response.ok) {
                const data = await response.json()
                setDonationTypes(data)
            }
        } catch (error) {
            console.error('Failed to fetch donation types:', error)
            toast.error('Không thể tải danh sách gói quyên góp')
        }
    }

    const getAmount = () => {
        if (customAmount) {
            return parseFloat(customAmount)
        }
        if (selectedType) {
            const type = donationTypes.find((t) => t.id === selectedType)
            return type ? Number(type.suggestedAmount) : 0
        }
        return 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const amount = getAmount()
        if (amount < 1000) {
            toast.error('Số tiền tối thiểu là 1,000₫')
            return
        }

        if (!isAnonymous && !donorName) {
            toast.error('Vui lòng nhập tên của bạn')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    message,
                    isAnonymous,
                    donorName: isAnonymous ? null : donorName,
                    donorEmail: isAnonymous ? null : donorEmail,
                    donorPhone: isAnonymous ? null : donorPhone,
                    typeId: selectedType,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                toast.success('Đã tạo quyên góp thành công!')
                router.push(data.redirectUrl)
            } else {
                const error = await response.json()
                toast.error(error.error || 'Có lỗi xảy ra')
            }
        } catch (error) {
            console.error('Error creating donation:', error)
            toast.error('Không thể tạo quyên góp. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">🧧 Gửi Lì Xì Cho Trừn</h1>
                    <p className="text-gray-600 text-lg">
                        Chúc Trừn một năm mới an khang - thịnh vượng - phát tài phát lộc! 🎊
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Donation Types */}
                    <Card>
                        <CardHeader>
                            <CardTitle>🎁 Chọn Phong Bao Lì Xì</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {donationTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedType(type.id)
                                            setCustomAmount('')
                                        }}
                                        className={`p-6 rounded-xl border-2 transition-all ${selectedType === type.id
                                            ? 'border-primary bg-primary/10 shadow-lg scale-105'
                                            : 'border-gray-200 hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="text-4xl mb-2">{type.icon || '💝'}</div>
                                        <div className="font-bold text-xl text-primary mb-1">
                                            {Number(type.suggestedAmount).toLocaleString('vi-VN')}₫
                                        </div>
                                        <div className="text-sm font-semibold mb-2">{type.name}</div>
                                        {type.description && (
                                            <div className="text-xs text-gray-600">{type.description}</div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Amount */}
                            <div className="space-y-2">
                                <Label htmlFor="customAmount">Hoặc tự chọn số tiền lì xì:</Label>
                                <div className="relative">
                                    <Input
                                        id="customAmount"
                                        type="number"
                                        value={customAmount}
                                        onChange={(e) => {
                                            setCustomAmount(e.target.value)
                                            setSelectedType(null)
                                        }}
                                        placeholder="Nhập số tiền..."
                                        className="pr-12"
                                        min="1000"
                                        step="1000"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                        ₫
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Số tiền tối thiểu: 1,000₫</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Message */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="message">Lời chúc Tết (tùy chọn):</Label>
                                <Textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Chúc Trừn năm mới an khang thịnh vượng..."
                                    className="min-h-[100px] resize-none"
                                    maxLength={500}
                                />
                                <p className="text-sm text-gray-500 text-right">{message.length}/500</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Donor Info */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="anonymous"
                                    checked={isAnonymous}
                                    onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                                />
                                <Label htmlFor="anonymous" className="font-semibold cursor-pointer">
                                    Quyên góp ẩn danh
                                </Label>
                            </div>

                            {!isAnonymous && (
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="space-y-2">
                                        <Label htmlFor="donorName">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="donorName"
                                            type="text"
                                            value={donorName}
                                            onChange={(e) => setDonorName(e.target.value)}
                                            placeholder="Nguyễn Văn A"
                                            required={!isAnonymous}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="donorEmail">Email</Label>
                                            <Input
                                                id="donorEmail"
                                                type="email"
                                                value={donorEmail}
                                                onChange={(e) => setDonorEmail(e.target.value)}
                                                placeholder="email@example.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="donorPhone">Số điện thoại</Label>
                                            <Input
                                                id="donorPhone"
                                                type="tel"
                                                value={donorPhone}
                                                onChange={(e) => setDonorPhone(e.target.value)}
                                                placeholder="0912345678"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold">Tổng lì xì:</span>
                                <span className="text-3xl font-bold text-primary">
                                    {getAmount().toLocaleString('vi-VN')}₫
                                </span>
                            </div>
                            <Button
                                type="submit"
                                disabled={loading || getAmount() < 1000}
                                className="w-full text-lg rounded-full"
                                size="lg"
                            >
                                {loading ? 'Đang xử lý...' : '🧧 Gửi Lì Xì Ngay'}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </main>
    )
}
