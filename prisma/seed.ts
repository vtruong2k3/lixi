import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create Donation Types
    console.log('Creating donation types...')
    const donationType1 = await prisma.donationType.upsert({
        where: { id: 'donation-type-1' },
        update: {},
        create: {
            id: 'donation-type-1',
            name: 'Một bát cơm',
            description: 'Giúp Trừn có một bữa ăn ngon',
            suggestedAmount: 50000,
            icon: '🍚',
            displayOrder: 1,
        },
    })

    const donationType2 = await prisma.donationType.upsert({
        where: { id: 'donation-type-2' },
        update: {},
        create: {
            id: 'donation-type-2',
            name: 'Một ngày ăn uống',
            description: 'Lo trọn 3 bữa cho Trừn trong ngày',
            suggestedAmount: 150000,
            icon: '🍱',
            displayOrder: 2,
        },
    })

    const donationType3 = await prisma.donationType.upsert({
        where: { id: 'donation-type-3' },
        update: {},
        create: {
            id: 'donation-type-3',
            name: 'Một tuần yêu thương',
            description: 'Chăm sóc Trừn cả tuần với đầy đủ dinh dưỡng',
            suggestedAmount: 500000,
            icon: '💝',
            displayOrder: 3,
        },
    })

    console.log('✅ Donation types created')

    // Create Goals
    console.log('Creating goals...')
    const goal1 = await prisma.goal.upsert({
        where: { id: 'goal-1' },
        update: {},
        create: {
            id: 'goal-1',
            title: 'Tiền ăn tháng 3/2026',
            description: 'Mục tiêu quyên góp để đảm bảo Trừn có đủ thức ăn chất lượng cho cả tháng 3',
            targetAmount: 5000000,
            currentAmount: 0,
            status: 'ACTIVE',
            deadline: new Date('2026-03-31'),
            displayOrder: 1,
        },
    })

    const goal2 = await prisma.goal.upsert({
        where: { id: 'goal-2' },
        update: {},
        create: {
            id: 'goal-2',
            title: 'Chi phí thú y Q1/2026',
            description: 'Kiểm tra sức khỏe định kỳ, tiêm phòng và thuốc men cần thiết',
            targetAmount: 3000000,
            currentAmount: 0,
            status: 'ACTIVE',
            deadline: new Date('2026-03-31'),
            displayOrder: 2,
        },
    })

    console.log('✅ Goals created')

    // Create Milestones for Goal 1
    console.log('Creating milestones...')
    await prisma.goalMilestone.createMany({
        data: [
            {
                goalId: goal1.id,
                amount: 1000000,
                description: '20% hoàn thành - 1 tuần đầu tiên',
            },
            {
                goalId: goal1.id,
                amount: 2500000,
                description: '50% hoàn thành - Nửa tháng',
            },
            {
                goalId: goal1.id,
                amount: 5000000,
                description: '100% hoàn thành - Cả tháng',
            },
        ],
        skipDuplicates: true,
    })

    console.log('✅ Milestones created')

    // Create Sample Admin User
    console.log('Creating admin user...')
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@truncommunity.com' },
        update: {},
        create: {
            email: 'admin@truncommunity.com',
            name: 'Admin',
            role: 'ADMIN',
            password: '$2a$10$XqZ8Zq3Z8Zq3Z8Zq3Z8Zq.dummy', // Placeholder - replace with real hash
        },
    })

    console.log('✅ Admin user created')

    // Create Sample Activity
    console.log('Creating sample activities...')
    await prisma.activity.create({
        data: {
            type: 'GOAL_CREATED',
            content: 'Mục tiêu mới "Tiền ăn tháng 3/2026" đã được tạo',
            metadata: {
                goalId: goal1.id,
                goalTitle: goal1.title,
            },
        },
    })

    console.log('✅ Sample activities created')

    // Create Sample Post
    console.log('Creating sample post...')
    await prisma.post.create({
        data: {
            title: 'Chào mừng đến với Trun Community! 🎉',
            content: 'Đây là nền tảng thiện nguyện để cùng nhau chăm sóc Trừn. Mỗi đóng góp của bạn đều có ý nghĩa!',
            type: 'ANNOUNCEMENT',
            isPublished: true,
            publishedAt: new Date(),
        },
    })

    console.log('✅ Sample post created')

    console.log('🎉 Database seeded successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Error seeding database:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
