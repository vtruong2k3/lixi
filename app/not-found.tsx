import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="text-center space-y-6 max-w-md">
                <div className="text-6xl">🔍</div>
                <h1 className="text-3xl font-bold text-gray-800">404 - Không tìm thấy trang</h1>
                <p className="text-gray-600">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                </p>
                <Link href="/" className="inline-block btn btn-primary">
                    Về trang chủ
                </Link>
            </div>
        </div>
    )
}
