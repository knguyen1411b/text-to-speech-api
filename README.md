# Text-to-Speech (TTS) API

Dịch vụ API chuyển đổi Văn bản thành Giọng nói (Text-to-Speech).

---

## 🚀 Tính năng chính

- **Chuyển đổi Text-to-Speech:** Chuyển văn bản thành file âm thanh dạng `.mp3`.
- **Hỗ trợ đa ngôn ngữ:** Hỗ trợ đầy đủ các ngôn ngữ phổ biến (mặc định: `vi` - Tiếng Việt, `en` - Tiếng Anh, `ja` - Tiếng Nhật,...).
---

## 📖 Hướng dẫn sử dụng API

### Cách 1: Sử dụng phương thức GET (Phù hợp nhúng trực tiếp)
Thích hợp khi đưa trực tiếp URL vào trình duyệt hoặc thẻ `<audio>` để phát trực tuyến.

- **URL:**
  `http://localhost:3000/api/tts`
- **Tham số truy vấn (Query Params):**
  - `key` (Bắt buộc): API Key.
  - `text` (Bắt buộc): Nội dung văn bản cần chuyển thành giọng nói.
  - `lang` (Tùy chọn): Mã ngôn ngữ (mặc định `vi`). Ví dụ: `vi`, `en`, `ja`, `ko`.

**Ví dụ thẻ HTML:**
```html
<audio controls>
  <source src="http://localhost:3000/api/tts?key=sk_your_secret_api_key_here&text=Xin chào bạn&lang=vi" type="audio/mpeg">
</audio>
```

---

### Cách 2: Sử dụng phương thức POST (Phù hợp gọi API)
Dành cho Frontend hoặc Backend kết nối API truyền tải nội dung dài.

- **URL:**
  `http://localhost:3000/api/tts`
- **Headers:**
  - `Content-Type: application/json`
  - `x-api-key: sk_your_secret_api_key_here` (hoặc sử dụng `Authorization: Bearer <API_KEY>`)
- **Body (JSON):**
  ```json
  {
    "text": "Xin chào! Đây là đoạn hội thoại cần chuyển đổi giọng nói.",
    "lang": "vi"
  }
  ```