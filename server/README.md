# HOANGGIA Video Intelligence API (experimental)

Backend này **không chạy trên GitHub Pages**. Chạy tại máy chủ Python có HTTPS (hoặc reverse proxy HTTPS). Frontend Script AI V1.4 yêu cầu nhập URL backend một lần trong ô "Máy chủ phân tích video".

## Cài đặt

```bash
python -m venv .venv
pip install -r server/requirements.txt
export GEMINI_API_KEY="your_server_side_key"
export FRONTEND_ORIGIN="https://hoanggiaktsda-beep.github.io"
uvicorn server.main:app --host 127.0.0.1 --port 8000
```

Trên Windows dùng `set GEMINI_API_KEY=...` trong Command Prompt hoặc `$env:GEMINI_API_KEY="..."` trong PowerShell.

Đưa dịch vụ lên HTTPS public để GitHub Pages truy cập. Backend cần `yt-dlp`, mạng truy cập video công khai và đủ dung lượng tạm thời. Một số TikTok / Instagram / Facebook / YouTube sẽ chặn tải hoặc đòi đăng nhập. Không được vượt rào kiểm soát truy cập.

### API
- `GET /api/health`
- `POST /api/analyze-video`, JSON `{"url":"https://www.tiktok.com/..."}`
- Returns `{"analysis":"...", "transcript":"...", "model":"..."}`

## Trước khi dùng cho người dùng thực
Dịch vụ chưa có authentication, rate limit, billing cap, kiểm soát nguồn tải nâng cao và giám sát chi phí. **Không công khai endpoint trên internet** trước khi bổ sung bảo vệ chống lạm dụng. Giới hạn dung lượng, timeout, allowlist nền tảng và xóa dữ liệu tạm đã được đặt ở mức cơ bản. Gemini API có thể phát sinh phí; không quảng cáo đây là hệ thống miễn phí hoàn toàn.

Lưu ý: mã này chưa được chạy kiểm thử tích hợp, API của nhà cung cấp hoặc khả năng truy xuất video có thể thay đổi.
