'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface Donation {
    id: string
    amount: number
    message: string | null
    donorName: string | null
    donorEmail: string | null
    donorPhone: string | null
    isAnonymous: boolean
    status: string
    createdAt: string
    type: {
        name: string
    } | null
    goal: {
        title: string
    } | null
}

export default function AdminDonationsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [donations, setDonations] = useState<Donation[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('PENDING')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedDonation, setSelectedDonation] = useState<string | null>(null)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin')
        } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/')
        }
    }, [status, session, router])

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
            fetchDonations()
        }
    }, [status, session, filter, page])

    const fetchDonations = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `/api/admin/donations?status=${filter}&page=${page}&limit=20`
            )
            if (response.ok) {
                const data = await response.json()
                setDonations(data.donations)
                setTotalPages(data.pagination.totalPages)
            }
        } catch (error) {
            console.error('Failed to fetch donations:', error)
            toast.error('Không thể tải danh sách quyên góp')
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async () => {
        if (!selectedDonation) return

        try {
            const response = await fetch(`/api/admin/donations/${selectedDonation}/approve`, {
                method: 'POST',
            })

            if (response.ok) {
                toast.success('Đã xác nhận thành công!')
                fetchDonations()
            } else {
                const error = await response.json()
                toast.error(error.error || 'Có lỗi xảy ra')
            }
        } catch (error) {
            console.error('Failed to approve donation:', error)
            toast.error('Không thể xác nhận. Vui lòng thử lại.')
        } finally {
            setSelectedDonation(null)
        }
    }

    const getStatusBadge = (status: string) => {
        if (status === 'COMPLETED') {
            return <Badge variant="outline" className="bg-green-100 text-green-800">Đã xác nhận</Badge>
        } else if (status === 'PENDING') {
            return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Chờ xác nhận</Badge>
        } else {
            return <Badge variant="outline" className="bg-red-100 text-red-800">Thất bại</Badge>
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <Skeleton className="h-12 w-64 mb-2" />
                    <Skeleton className="h-6 w-96 mb-8" />
                    <Card>
                        <CardContent className="pt-6">
                            <Skeleton className="h-10 w-full mb-4" />
                            <Skeleton className="h-32 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
        return null
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">🔐 Admin Dashboard</h1>
                    <p className="text-gray-600">Quản lý quyên góp và xác nhận thanh toán</p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex gap-2 flex-wrap">
                            {['PENDING', 'COMPLETED', 'FAILED', 'ALL'].map((statusFilter) => (
                                <Button
                                    key={statusFilter}
                                    onClick={() => {
                                        setFilter(statusFilter === 'ALL' ? '' : statusFilter)
                                        setPage(1)
                                    }}
                                    variant={(statusFilter === 'ALL' ? !filter : filter === statusFilter) ? 'default' : 'outline'}
                                >
                                    {statusFilter === 'PENDING'
                                        ? 'Chờ xác nhận'
                                        : statusFilter === 'COMPLETED'
                                            ? 'Đã xác nhận'
                                            : statusFilter === 'FAILED'
                                                ? 'Thất bại'
                                                : 'Tất cả'}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Donations Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Danh Sách Quyên Góp</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {donations.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Không có quyên góp nào</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mã GD</TableHead>
                                            <TableHead>Người quyên góp</TableHead>
                                            <TableHead className="text-right">Số tiền</TableHead>
                                            <TableHead>Lời nhắn</TableHead>
                                            <TableHead>Thời gian</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead className="text-center">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {donations.map((donation) => (
                                            <TableRow key={donation.id}>
                                                <TableCell>
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {donation.id.slice(0, 8)}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    {donation.isAnonymous ? (
                                                        <span className="text-gray-500 italic">Ẩn danh</span>
                                                    ) : (
                                                        <div>
                                                            <div className="font-semibold">{donation.donorName || 'N/A'}</div>
                                                            {donation.donorEmail && (
                                                                <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="font-bold text-primary">
                                                        {Number(donation.amount).toLocaleString('vi-VN')}₫
                                                    </span>
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    {donation.message ? (
                                                        <p className="text-sm text-gray-600 truncate">{donation.message}</p>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-500">
                                                    {formatDistanceToNow(new Date(donation.createdAt), {
                                                        addSuffix: true,
                                                        locale: vi,
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(donation.status)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {donation.status === 'PENDING' && (
                                                        <Button
                                                            onClick={() => setSelectedDonation(donation.id)}
                                                            size="sm"
                                                            className="bg-success hover:bg-success/90"
                                                        >
                                                            ✓ Xác nhận
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        <Button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            variant="outline"
                        >
                            ← Trước
                        </Button>
                        <span className="px-4 py-2 flex items-center">
                            Trang {page} / {totalPages}
                        </span>
                        <Button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            variant="outline"
                        >
                            Sau →
                        </Button>
                    </div>
                )}

                {/* Confirm Dialog */}
                <AlertDialog open={!!selectedDonation} onOpenChange={() => setSelectedDonation(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận thanh toán</AlertDialogTitle>
                            <AlertDialogDescription>
                                Bạn có chắc chắn đã nhận được tiền chuyển khoản cho giao dịch này không?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={handleApprove}>Xác nhận</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </main>
    )
}
