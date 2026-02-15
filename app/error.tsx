'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="text-center space-y-6 max-w-md">
                <div className="text-6xl">😔</div>
                <h1 className="text-3xl font-bold text-gray-800">Oops! Có lỗi xảy ra</h1>
                <p className="text-gray-600">
                    Chúng tôi xin lỗi vì sự bất tiện này. Đã có lỗi xảy ra khi xử lý yêu cầu của bạn.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="btn btn-primary"
                    >
                        Thử lại
                    </button>
                    <Link href="/" className="btn btn-outline">
                        Về trang chủ
                    </Link>
                </div>
                {error.digest && (
                    <p className="text-xs text-gray-400">Error ID: {error.digest}</p>
                )}
            </div>
        </div>
    )
}
