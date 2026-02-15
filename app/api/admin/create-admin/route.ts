import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

/**
 * API Endpoint to create an admin user
 * POST /api/admin/create-admin
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, name } = body

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists', user: { email: existingUser.email, role: existingUser.role } },
                { status: 400 }
            )
        }

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create admin user
        const adminUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || 'Admin',
                role: 'ADMIN',
                emailVerified: new Date(),
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            }
        })

        console.log('✅ Admin user created:', adminUser)

        return NextResponse.json({
            success: true,
            message: 'Admin user created successfully',
            user: adminUser,
            credentials: {
                email,
                password: '(hidden - use the password you provided)'
            }
        })
    } catch (error) {
        console.error('❌ Error creating admin user:', error)
        return NextResponse.json(
            { error: 'Failed to create admin user', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

