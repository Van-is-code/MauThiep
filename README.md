# Quản Lý Mẫu Thiệp - React Project

Một ứng dụng React được xây dựng với Vite để quản lý các mẫu thiệp cưới. Ứng dụng cho phép hiển thị, quản lý các mẫu thiệp từ một file JSON.

## ✨ Tính Năng

✅ **Giao diện hiện đại** - Thiết kế luxury sang trọng  
✅ **Component-based architecture** - Cấu trúc tổ chức rõ ràng  
✅ **4 mẫu thiệp mỗi trang** - Phân trang thông minh  
✅ **Quản lý dữ liệu JSON** - Dễ dàng thêm/xóa mẫu  
✅ **Responsive Design** - Hoạt động trên mọi thiết bị  
✅ **Smooth Animations** - Hiệu ứng chuyển động mượt mà  

## 📁 Cấu Trúc Dự Án

```
src/
├── components/                 # Các component React
│   ├── Header.tsx             # Header component
│   ├── SectionIntro.tsx       # Section giới thiệu
│   ├── Gallery.tsx            # Thư viện hiển thị
│   ├── Card.tsx               # Card component (mẫu thiệp)
│   ├── Pagination.tsx         # Phân trang
│   └── Footer.tsx             # Footer component
├── styles/                    # CSS cho từng component
│   ├── Header.css
│   ├── SectionIntro.css
│   ├── Gallery.css
│   ├── Card.css
│   ├── Pagination.css
│   └── Footer.css
├── App.tsx                    # Component chính
├── App.css                    # Global styles
├── main.tsx                   # Entry point
└── index.css                  # Global CSS

public/
├── data.json                  # Dữ liệu mẫu thiệp
└── templates/                 # 📁 Folder chứa các folder thiệp của bạn
    ├── template-1/
    ├── template-2/
    └── ...

```

## 🚀 Cài Đặt & Chạy

### 1. Cài đặt dependencies:
```bash
npm install
```

### 2. Chạy development server:
```bash
npm run dev
```

### 3. Build cho production:
```bash
npm run build
```

## 📋 Cấu Trúc File data.json

```json
{
  "templates": [
    {
      "id": 1,
      "title": "Tên Thiệp",
      "style": "Phong cách · Mô tả",
      "category": "classic",
      "url": "/template/1",
      "color": "#f5f0e8"
    }
  ]
}
```

### Tham số:
- **id**: Mã định danh (số nguyên)
- **title**: Tên mẫu thiệp
- **style**: Phong cách/mô tả thiệp
- **category**: Loại hình (classic, floral, minimal, rustic, modern)
- **url**: Đường dẫn liên kết
- **color**: Màu nền (hex color)

## 📁 Folder templates

Sử dụng folder `public/templates/` để lưu trữ các folder thiệp của bạn:

```
public/templates/
├── template-1/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── template-2/
│   └── ...
```

## 🔧 Component Breakdown

### Header (`Header.tsx`)
- Hiển thị logo "WedThiệp"
- Sticky header

### SectionIntro (`SectionIntro.tsx`)
- Tiêu đề "Bộ Sưu Tập Mẫu"
- Decoration lines

### Gallery (`Gallery.tsx`)
- Hiển thị danh sách Card
- Responsive grid (4 card mobile, 2-4 card desktop)

### Card (`Card.tsx`)
- Hiển thị 1 mẫu thiệp
- Overlay hay khi hover
- Nút xóa

### Pagination (`Pagination.tsx`)
- Điều hướng trang
- 4 mẫu thiệp mỗi trang

### Footer (`Footer.tsx`)
- Copyright & branding

## 🎨 Biến CSS

Chỉnh sửa `:root` trong `App.css`:

```css
:root {
  --cream: #faf8f4;
  --gold: #c8a96e;
  --text-dark: #2a2318;
  /* ... */
}
```

## 📱 Responsive

- **Desktop**: 4 card 1 hàng
- **Tablet**: 2 card 1 hàng
- **Mobile**: 2 card 1 hàng

## 🛠️ Scripts

```bash
npm run dev      # Chạy dev server
npm run build    # Build production
npm run preview  # Preview build
```

## 💡 Tips

1. **Thêm mẫu thiệp**: Sửa file `public/data.json`
2. **Thay đổi màu**: Cập nhật `--gold` trong `App.css`
3. **Thêm folder thiệp**: Tạo subfolder trong `public/templates/`

---

**Công Nghệ**: React 18 + TypeScript + Vite  
**Năm**: 2026  
**Tác Giả**: WedThiệp
