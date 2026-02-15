'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

interface BankQRProps {
    donationId: string
    onClose?: () => void
}

interface QRData {
    qrUrl: string
    bankInfo: {
        bankCode: string
        accountNo: string
        accountName: string
        amount: string
        content: string
    }
}

export default function BankQRCode({ donationId, onClose }: BankQRProps) {
    const [qrData, setQrData] = useState<QRData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchQRCode()
    }, [donationId])

    const fetchQRCode = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/payment/qr?donationId=${donationId}`)

            if (!response.ok) {
                throw new Error('Failed to generate QR code')
            }

            const data = await response.json()
            setQrData(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert('Đã copy!')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error || !qrData) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500">Lỗi: {error || 'Không thể tạo QR code'}</p>
                <button
                    onClick={fetchQRCode}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded hover:opacity-90"
                >
                    Thử lại
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-xl max-w-md mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Chuyển khoản ngân hàng
                </h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* QR Code */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <Image
                        src={qrData.qrUrl}
                        alt="QR Code chuyển khoản"
                        width={300}
                        height={300}
                        className="mx-auto"
                        priority
                    />
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                    Quét mã QR bằng app ngân hàng để chuyển khoản
                </p>
            </div>

            {/* Bank Info */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-semibold">{qrData.bankInfo.bankCode}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{qrData.bankInfo.accountNo}</span>
                        <button
                            onClick={() => copyToClipboard(qrData.bankInfo.accountNo)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                            📋
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <span className="font-semibold">{qrData.bankInfo.accountName}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded border border-yellow-200">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-bold text-lg text-orange-600">
                        {Number(qrData.bankInfo.amount).toLocaleString('vi-VN')}₫
                    </span>
                </div>

                <div className="flex justify-between items-start p-3 bg-red-50 rounded border border-red-200">
                    <span className="text-gray-600">Nội dung CK:</span>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-red-600">
                            {qrData.bankInfo.content}
                        </span>
                        <button
                            onClick={() => copyToClipboard(qrData.bankInfo.content)}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            📋
                        </button>
                    </div>
                </div>
            </div>

            {/* Important Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-800 font-semibold mb-2">
                    ⚠️ Lưu ý quan trọng:
                </p>
                <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Vui lòng giữ NGUYÊN nội dung chuyển khoản</li>
                    <li>• Chuyển khoản đúng số tiền như trên</li>
                    <li>• Sau khi chuyển khoản, giao dịch sẽ được xác nhận trong 5-10 phút</li>
                </ul>
            </div>

            {/* Help Text */}
            <p className="text-center text-xs text-gray-500">
                Bạn cần hỗ trợ? Liên hệ: support@truncommunity.com
            </p>
        </div>
    )
}
