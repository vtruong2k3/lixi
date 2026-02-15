import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seedDonationTypes() {
    console.log('🌱 Creating donation types...')

    await prisma.donationType.createMany({
        data: [
            {
                id: 'donation-type-1',
                name: 'Một bát cơm',
                description: 'Giúp Trừn có một bữa ăn ngon',
                suggestedAmount: 50000,
                icon: '🍚',
                displayOrder: 1,
            },
            {
                id: 'donation-type-2',
                name: 'Một ngày ăn uống',
                description: 'Lo trọn 3 bữa cho Trừn trong ngày',
                suggestedAmount: 150000,
                icon: '🍱',
                displayOrder: 2,
            },
            {
                id: 'donation-type-3',
                name: 'Một tuần yêu thương',
                description: 'Chăm sóc Trừn cả tuần với đầy đủ dinh dưỡng',
                suggestedAmount: 500000,
                icon: '💝',
                displayOrder: 3,
            },
        ],
        skipDuplicates: true,
    })

    console.log('✅ Donation types created!')
    await prisma.$disconnect()
    await pool.end()
}

seedDonationTypes().catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
})
