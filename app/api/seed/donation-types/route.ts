import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        console.log('🌱 Creating donation types...')

        await prisma.donationType.createMany({
            data: [
                {
                    id: 'donation-type-1',
                    name: 'Lì Xì May Mắn',
                    description: 'Gửi một phong bao nhỏ đầy may mắn cho Trừn',
                    suggestedAmount: 50000,
                    icon: '🧧',
                    displayOrder: 1,
                },
                {
                    id: 'donation-type-2',
                    name: 'Lì Xì Phát Tài',
                    description: 'Chúc Trừn một năm mới phát tài phát lộc',
                    suggestedAmount: 150000,
                    icon: '💰',
                    displayOrder: 2,
                },
                {
                    id: 'donation-type-3',
                    name: 'Lì Xì Đại Cát',
                    description: 'Gửi lời chúc an khang thịnh vượng đến Trừn',
                    suggestedAmount: 500000,
                    icon: '🎁',
                    displayOrder: 3,
                },
            ],
            skipDuplicates: true,
        })

        console.log('✅ Donation types created!')

        return NextResponse.json({ success: true, message: 'Donation types created!' })
    } catch (error) {
        console.error('❌ Error:', error)
        return NextResponse.json({ error: 'Failed to create donation types' }, { status: 500 })
    }
}
