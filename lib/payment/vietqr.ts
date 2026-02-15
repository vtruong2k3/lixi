/**
 * VietQR - Vietnam Bank Transfer QR Code Generator
 * Spec: https://www.vietqr.io/danh-sach-api
 */

export interface VietQRParams {
    accountNo: string          // Số tài khoản
    accountName: string         // Tên tài khoản
    bankCode: string           // Mã ngân hàng (VCB, TCB, MBB, etc.)
    amount?: number            // Số tiền (optional)
    description?: string       // Nội dung chuyển khoản
    template?: 'compact' | 'qr_only' | 'print' // Template type
}

export interface VietQRResponse {
    code: string
    desc: string
    data: {
        qrCode: string          // Base64 QR code image
        qrDataURL: string       // Data URL của QR
    }
}

const VIET_QR_API = 'https://img.vietqr.io/image'

/**
 * Generate VietQR code via API
 * @param params QR parameters
 * @returns QR code image URL
 */
export async function generateVietQR(params: VietQRParams): Promise<string> {
    const {
        accountNo,
        accountName,
        bankCode,
        amount,
        description = 'Ung ho Trun Community',
        template = 'compact'
    } = params

    // Build URL với query parameters
    const url = new URL(`${VIET_QR_API}/${bankCode}-${accountNo}-${template}.jpg`)

    if (amount && amount > 0) {
        url.searchParams.append('amount', amount.toString())
    }

    url.searchParams.append('addInfo', description)
    url.searchParams.append('accountName', accountName)

    return url.toString()
}

/**
 * Generate static QR code URL (không cần API call)
 * Dùng cho việc hiển thị nhanh
 */
export function generateStaticVietQR(
    donationId: string,
    amount?: number
): string {
    const bankCode = process.env.BANK_CODE || 'MB' // MBBank
    const accountNo = process.env.BANK_ACCOUNT_NO || ''
    const accountName = process.env.BANK_ACCOUNT_NAME || 'TRUN COMMUNITY'

    const description = `TRUN ${donationId.slice(0, 8)}`

    // Build URL directly (same logic as generateVietQR but sync)
    const template = 'compact'
    const url = new URL(`${VIET_QR_API}/${bankCode}-${accountNo}-${template}.jpg`)

    if (amount && amount > 0) {
        url.searchParams.append('amount', amount.toString())
    }

    url.searchParams.append('addInfo', description)
    url.searchParams.append('accountName', accountName)

    return url.toString()
}

/**
 * Parse payment content to extract donation ID
 * Format: "TRUN <donationId>"
 */
export function parseBankTransferContent(content: string): string | null {
    const match = content.match(/TRUN\s+([a-z0-9]+)/i)
    return match ? match[1] : null
}

/**
 * Available Vietnamese banks for VietQR
 */
export const VIETNAM_BANKS = [
    { code: 'VCB', name: 'Vietcombank' },
    { code: 'TCB', name: 'Techcombank' },
    { code: 'MB', name: 'MBBank' },
    { code: 'ACB', name: 'ACB' },
    { code: 'VPB', name: 'VPBank' },
    { code: 'TPB', name: 'TPBank' },
    { code: 'STB', name: 'Sacombank' },
    { code: 'VIB', name: 'VIB' },
    { code: 'BIDV', name: 'BIDV' },
    { code: 'AGR', name: 'Agribank' },
    { code: 'OCB', name: 'OCB' },
    { code: 'MSB', name: 'MSB' },
    { code: 'NAB', name: 'NamABank' },
    { code: 'VAB', name: 'VietABank' },
    { code: 'SCB', name: 'SCB' },
] as const

export type BankCode = typeof VIETNAM_BANKS[number]['code']
