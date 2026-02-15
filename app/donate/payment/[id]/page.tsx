import BankQRCode from '@/components/payment/BankQRCode'
import Link from 'next/link'

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="container mx-auto max-w-2xl">
                {/* Back Button */}
                <Link
                    href="/donate"
                    className="inline-flex items-center text-gray-600 hover:text-primary mb-6"
                >
                    ← Quay lại
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Thanh Toán lixi</h1>
                    <p className="text-gray-600">
                        Quét mã QR bằng app ngân hàng để hoàn tất lixi cho Trừn
                    </p>
                </div>

                {/* QR Code Component */}
                <BankQRCode donationId={id} />

                {/* Instructions */}
                <div className="mt-8 card bg-blue-50 border border-blue-200">
                    <h3 className="font-bold text-lg mb-3">📱 Hướng dẫn thanh toán:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Mở app ngân hàng của bạn</li>
                        <li>Chọn chức năng quét QR Code</li>
                        <li>Quét mã QR bên trên</li>
                        <li>Kiểm tra thông tin và xác nhận chuyển khoản</li>
                        <li>Chờ xác nhận từ hệ thống (5-10 phút)</li>
                    </ol>
                </div>

                {/* Support */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    Gặp vấn đề? Liên hệ: <a href="mailto:support@truncommunity.com" className="text-primary hover:underline">support@truncommunity.com</a>
                </div>
            </div>
        </main>
    )
}
