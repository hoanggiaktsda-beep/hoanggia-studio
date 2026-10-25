"""HOANGGIA VIDEO INTELLIGENCE backend.
Deploy separately from GitHub Pages; requires yt-dlp + Gemini API key.
Only analyze videos you have rights to access and process.
"""
import os
import json
import tempfile
import pathlib
import subprocess
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from google import genai

ALLOWED_HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be",
                 "tiktok.com", "www.tiktok.com", "facebook.com", "www.facebook.com",
                 "fb.watch", "instagram.com", "www.instagram.com"}
PUBLIC_ORIGIN = os.getenv("FRONTEND_ORIGIN", "https://hoanggiaktsda-beep.github.io")
API_KEY = os.getenv("GEMINI_API_KEY", "")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
MAX_MB = int(os.getenv("MAX_VIDEO_MB", "100"))
app = FastAPI(title="HOANGGIA Video Intelligence")
app.add_middleware(CORSMiddleware, allow_origins=[PUBLIC_ORIGIN], allow_methods=["POST", "GET"],
                   allow_headers=["Content-Type"])

class AnalysisRequest(BaseModel):
    url: HttpUrl

@app.get("/api/health")
def health():
    return {"ready": bool(API_KEY), "service": "HOANGGIA Video Intelligence"}

@app.post("/api/analyze-video")
def analyze(req: AnalysisRequest):
    from urllib.parse import urlparse
    u = str(req.url)
    if urlparse(u).hostname not in ALLOWED_HOSTS:
        raise HTTPException(400, "Nền tảng video không được hỗ trợ.")
    if not API_KEY:
        raise HTTPException(503, "Máy chủ chưa cấu hình GEMINI_API_KEY.")
    client = genai.Client(api_key=API_KEY)
    with tempfile.TemporaryDirectory(prefix="hg-video-") as tmp:
        template = os.path.join(tmp, "source.%(ext)s")
        cmd = ["yt-dlp", "--no-playlist", "--no-warnings", "--restrict-filenames",
               "--max-filesize", f"{MAX_MB}M", "-f", "best[ext=mp4]/best",
               "--output", template, "--", u]
        try:
            result = subprocess.run(cmd, check=False, capture_output=True, text=True,
                                    timeout=150, cwd=tmp)
        except subprocess.TimeoutExpired:
            raise HTTPException(504, "Tải video quá thời gian.")
        if result.returncode:
            raise HTTPException(422, "Không tải được video. Nguồn có thể chặn truy cập hoặc yêu cầu đăng nhập.")
        files = [p for p in pathlib.Path(tmp).glob("source.*") if p.is_file()]
        if not files:
            raise HTTPException(422, "Không tìm thấy tệp video.")
        video = files[0]
        if video.stat().st_size > MAX_MB * 1024 * 1024:
            raise HTTPException(413, "Video vượt dung lượng cho phép.")
        uploaded = None
        try:
            uploaded = client.files.upload(file=str(video))
            prompt = """Phân tích TOÀN BỘ video bằng tiếng Việt cho công cụ sản xuất nội dung.
Video có thể không có lời thoại. Không được bịa chi tiết ngoài những gì nhìn thấy hoặc nghe thấy.
Trả lời dưới dạng 2 phần bắt đầu bằng 'TRANSCRIPT:' và 'ANALYSIS:'.
TRANSCRIPT: Lời thoại có thực; nếu không có ghi 'Không có lời thoại xác định'.
ANALYSIS: Visual hook 0-3 giây; diễn biến từng beat và thời gian; chuyển cảnh, loại shot,
chuyển động máy quay (nếu quan sát được), màu sắc, ánh sáng, nhịp dựng, âm thanh/nhạc (nếu nghe thấy),
CTA, lý do nội dung thu hút người xem (nhận định, không khẳng định số liệu viral),
và một storyboard mới dựa trên nguyên lý kể chuyện nhưng không sao chép nội dung gốc.
"""
            response = client.models.generate_content(model=MODEL, contents=[uploaded, prompt])
            body = (response.text or "").strip()
            if not body:
                raise HTTPException(502, "AI không trả về nội dung phân tích.")
            transcript = ""
            analysis = body
            if "ANALYSIS:" in body:
                before, analysis = body.split("ANALYSIS:", 1)
                transcript = before.replace("TRANSCRIPT:", "").strip()
            return {"analysis": analysis.strip(), "transcript": transcript, "model": MODEL}
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(502, "AI không thể phân tích video. Kiểm tra cấu hình và quyền truy cập.")
        finally:
            if uploaded:
                try: client.files.delete(name=uploaded.name)
                except Exception: pass
