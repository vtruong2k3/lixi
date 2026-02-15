# 🏦 Hướng Dẫn Sử Dụng Chuyển Khoản Ngân Hàng

Dự án Trun Community sử dụng **VietQR** - chuẩn QR code chuyển khoản ngân hàng của Việt Nam.

## 🎯 Ưu điểm

✅ **Đơn giản** - Không cần đăng ký API, không phí giao dịch\
✅ **Phổ biến** - Mọi ngân hàng VN đều hỗ trợ\
✅ **An toàn** - Chuyển khoản trực tiếp vào tài khoản\
✅ **Minh bạch** - Dễ đối soát và báo cáo tài chính

## 📋 Cách Hoạt Động

### 1. User Flow

```
User chọn quyên góp
    ↓
Nhập số tiền và message
    ↓
Tạo donation record (status: PENDING)
    ↓
Hiển thị QR code + thông tin chuyển khoản
    ↓
User quét QR bằng app ngân hàng
    ↓
Chuyển khoản với nội dung: "TRUN <donationId>"
    ↓
Admin xác nhận giao dịch thủ công
    ↓
Cập nhật donation status → COMPLETED
```

### 2. Tạo QR Code

```typescript
// API: /api/payment/qr?donationId=xxx
const qrUrl = await generateVietQR({
  bankCode: 'MB',
  accountNo: '0123456789',
  accountName: 'TRUN COMMUNITY',
  amount: 100000,
  description: 'TRUN abc12345'
})
```

### 3. Component Sử Dụng

```tsx
import BankQRCode from '@/components/payment/BankQRCode'

<BankQRCode 
  donationId="donation-id-here"
  onClose={() => setShowQR(false)}
/>
```

## ⚙️ Cấu Hình

Thêm vào `.env`:

```bash
BANK_CODE="MB"              # Mã ngân hàng
BANK_ACCOUNT_NO="0123456789" # Số tài khoản
BANK_ACCOUNT_NAME="TRUN COMMUNITY" # Tên chủ tài khoản
```

### Mã Ngân Hàng Phổ Biến

| Mã | Tên Ngân Hàng |
|----|---------------|
| `VCB` | Vietcombank |
| `TCB` | Techcombank |
| `MB` | MBBank |
| `ACB` | ACB |
| `BIDV` | BIDV |
| `VPB` | VPBank |
| `TPB` | TPBank |

## 🔄 Xác Nhận Giao Dịch

### Cách 1: Thủ Công (Đề xuất cho giai đoạn đầu)

1. Kiểm tra sao kê ngân hàng hàng ngày
2. Tìm các giao dịch có nội dung bắt đầu bằng "TRUN"
3. Trích xuất donation ID từ nội dung
4. Cập nhật status trong database:

```typescript
await prisma.donation.update({
  where: { id: donationId },
  data: { status: 'COMPLETED' }
})

await prisma.transaction.create({
  data: {
    donationId,
    provider: 'BANK_TRANSFER',
    amount: actualAmount,
    status: 'COMPLETED',
    metadata: {
      bankTransactionId: 'FT123456789',
      verifiedBy: 'admin',
      verifiedAt: new Date()
    }
  }
})
```

### Cách 2: Tự Động (Nâng Cao)

Sử dụng Banking API nếu ngân hàng hỗ trợ:

* **VietQR API** (https://vietqr.io) - Có API query transactions
* **OpenBanking VN** - Tích hợp API của ngân hàng

## 📱 UI Components

### BankQRCode Component

Hiển thị:

* ✅ QR code image
* ✅ Thông tin ngân hàng
* ✅ Số tiền
* ✅ Nội dung chuyển khoản (có thể copy)
* ✅ Hướng dẫn sử dụng

### Features:

* Loading state
* Error handling
* Copy to clipboard
* Responsive design

## 🎨 Customization

### Thay Đổi QR Template

```typescript
generateVietQR({
  // ...
  template: 'compact'  // 'compact' | 'qr_only' | 'print'
})
```

* `compact`: QR + thông tin ngân hàng (mặc định)
* `qr_only`: Chỉ QR code
* `print`: Template để in

### Custom QR Size

VietQR API tự động scale, hoặc dùng URL params:

```
https://img.vietqr.io/image/MB-0123456789-compact.jpg?width=500&height=500
```

## 🔐 Bảo Mật

✅ **Nội dung CK là unique** - TRUN + 8 ký tự đầu của donation ID\
✅ **Không lưu thông tin ngân hàng user**\
✅ **Admin verification** - Đảm bảo số tiền chính xác

## 📊 Báo Cáo Tài Chính

Query donations theo bank transfer:

```typescript
const bankDonations = await prisma.donation.findMany({
  where: {
    status: 'COMPLETED',
    transaction: {
      provider: 'BANK_TRANSFER'
    }
  },
  include: {
    transaction: true,
    user: true
  },
  orderBy: {
    createdAt: 'desc'
  }
})
```

## 🚀 Next Steps

1. **Admin Dashboard** - Tạo UI để xác nhận transactions
2. **Email Notifications** - Gửi email khi donation completed
3. **Export Reports** - Xuất báo cáo Excel cho accountant
4. **Banking API** - Tích hợp API tự động đối soát (if available)

## 📞 Support

Nếu có vấn đề với QR code hoặc chuyển khoản:

* Check logs trong database (`transactions` table)
* Verify bank account info trong `.env`
* Test QR generation với amount nhỏ trước

***

**Lưu ý**: Phương thức này phù hợp nhất cho:

* Dự án community nhỏ
* Số lượng giao dịch < 100/ngày
* Có admin active để verify

Nếu scale lớn hơn, cân nhắc tích hợp Payment Gateway chính thức.
