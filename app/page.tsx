import HeroSection from '@/components/home/HeroSection'
import RecentActivities from '@/components/home/RecentActivities'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import './globals.css'

export const metadata = {
  title: 'Trun Community - Gửi Lì Xì Nhận Phúc Lộc',
  description: 'Năm mới Ất Tỵ - Cùng gửi lì xì chúc Trừn an khang thịnh vượng',
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Vì Sao Gửi Lì Xì Qua Trun Community?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="text-5xl">🔍</div>
                <h3 className="text-xl font-bold">Minh Bạch 100%</h3>
                <p className="text-gray-600">
                  Mọi phong bao lì xì đều được công khai, báo cáo chi tiết định kỳ
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="text-5xl">⚡</div>
                <h3 className="text-xl font-bold">Nhanh Chóng</h3>
                <p className="text-gray-600">
                  Gửi lì xì chỉ trong 3 bước đơn giản qua QR code ngân hàng
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="text-5xl">❤️</div>
                <h3 className="text-xl font-bold">Ý Nghĩa</h3>
                <p className="text-gray-600">
                  Mỗi đóng góp nhỏ đều tạo nên sự khác biệt lớn cho Trừn
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <RecentActivities />

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Sẵn Sàng Gửi Lì Xì?
          </h2>
          <p className="text-xl text-white/90">
            Cùng gửi lời chúc Tết và phong bao nhỏ giúp Trừn có một năm mới thật hạnh phúc
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl text-lg rounded-full">
            <Link href="/donate">🧧 Gửi Lì Xì Ngay</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Trun Community</h3>
              <p className="text-gray-400">
                Nền tảng gửi lì xì Tết minh bạch, đơn giản và ý nghĩa
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Liên Kết</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/donate" className="hover:text-white">Gửi lì xì</Link></li>
                <li><Link href="/goals" className="hover:text-white">Mục tiêu</Link></li>
                <li><Link href="/about" className="hover:text-white">Về chúng tôi</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Liên Hệ</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@truncommunity.com</li>
                <li>📱 Facebook: /truncommunity</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Trun Community. Made with ❤️ for Trừn</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
