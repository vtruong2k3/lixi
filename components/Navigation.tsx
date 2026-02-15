'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
    const pathname = usePathname()
    const { data: session, status } = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const isActive = (path: string) => pathname === path

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🐾</span>
                        <span className="text-xl font-bold text-primary">Trừn</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className={`font-semibold transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                                }`}
                        >
                            Trang chủ
                        </Link>
                        <Link
                            href="/donate"
                            className={`font-semibold transition-colors ${isActive('/donate') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                                }`}
                        >
                            Gửi lì xì
                        </Link>
                        <Link
                            href="/goals"
                            className={`font-semibold transition-colors ${isActive('/goals') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                                }`}
                        >
                            Mục tiêu
                        </Link>

                        {status === 'authenticated' ? (
                            <>
                                {session?.user?.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className={`font-semibold transition-colors ${isActive('/admin') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                                            }`}
                                    >
                                        🔐 Admin
                                    </Link>
                                )}
                                <Button
                                    onClick={() => signOut()}
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    Đăng xuất
                                </Button>
                            </>
                        ) : status === 'unauthenticated' ? (
                            <Button asChild variant="outline" className="rounded-full">
                                <Link href="/api/auth/signin">Đăng nhập</Link>
                            </Button>
                        ) : null}

                        <Button asChild className="rounded-full">
                            <Link href="/donate">🧧 Lì xì ngay</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px]">
                            <div className="flex flex-col gap-4 mt-8">
                                <Link
                                    href="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-2 font-semibold ${isActive('/') ? 'text-primary' : 'text-gray-600'
                                        }`}
                                >
                                    Trang chủ
                                </Link>
                                <Link
                                    href="/donate"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-2 font-semibold ${isActive('/donate') ? 'text-primary' : 'text-gray-600'
                                        }`}
                                >
                                    Gửi lì xì
                                </Link>
                                <Link
                                    href="/goals"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-2 font-semibold ${isActive('/goals') ? 'text-primary' : 'text-gray-600'
                                        }`}
                                >
                                    Mục tiêu
                                </Link>
                                {session?.user?.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block py-2 font-semibold ${isActive('/admin') ? 'text-primary' : 'text-gray-600'
                                            }`}
                                    >
                                        🔐 Admin
                                    </Link>
                                )}
                                {status === 'authenticated' ? (
                                    <Button
                                        onClick={() => {
                                            signOut()
                                            setMobileMenuOpen(false)
                                        }}
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        Đăng xuất
                                    </Button>
                                ) : (
                                    <Button asChild variant="outline" onClick={() => setMobileMenuOpen(false)}>
                                        <Link href="/api/auth/signin">Đăng nhập</Link>
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
