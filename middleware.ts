import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Protected admin routes
    if (path.startsWith('/admin')) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        })

        if (!token) {
            // Redirect to signin if not authenticated
            return NextResponse.redirect(new URL('/api/auth/signin', request.url))
        }

        if (token.role !== 'ADMIN') {
            // Redirect to home if not admin
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
