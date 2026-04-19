"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/Toast";
import { uploadProfileImage } from "@/lib/uploadImage";
import Button from "@/components/ui/Button";

export default function ProfileImagePage() {
  const router = useRouter();
  const { nickname, profileImageUrl, setAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const displayName = nickname ?? "\uC0AC\uC6A9\uC790";
  const initial = displayName.charAt(0);
  const currentImage = preview ?? profileImageUrl;

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const data = await uploadProfileImage(selectedFile);
      setAuth({ isLoggedIn: true, nickname, profileImageUrl: data.profileImageUrl });
      // 세션에도 저장
      await fetch("/api/auth/me/profile-image", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImageUrl: data.profileImageUrl }),
      }).catch(() => {});
      toast("\uD504\uB85C\uD544 \uC774\uBBF8\uC9C0\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4");
      router.back();
    } catch {
      toast("\uB124\uD2B8\uC6CC\uD06C \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex shrink-0 items-center border-b border-beige-dark px-5 pb-3 pt-4">
        <button onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70">
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4L6 9L11 14" />
          </svg>
        </button>
        <span className="flex-1 text-center text-[16px] font-semibold text-ink">프로필 이미지</span>
        <div className="w-9" />
      </header>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      <div className="flex flex-1 flex-col items-center px-5 pt-10">
        {/* 미리보기 */}
        <button
          onClick={handleSelectFile}
          className="group relative flex h-[140px] w-[140px] items-center justify-center overflow-hidden rounded-full border-[3px] border-beige-dark bg-beige-mid"
        >
          {currentImage ? (
            <img src={currentImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[48px] font-semibold text-ink-muted/40">{initial}</span>
          )}
          {/* 오버레이 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-active:opacity-100">
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8}>
              <rect x={2} y={5} width={20} height={16} rx={2} />
              <circle cx={12} cy={13} r={4} />
              <path d="M8 5L9.5 2H14.5L16 5" />
            </svg>
          </div>
        </button>

        <button
          onClick={handleSelectFile}
          className="mt-4 text-[14px] font-medium text-wine"
        >
          사진 선택
        </button>

        {preview && (
          <p className="mt-2 text-[12px] text-ink-muted">
            새 이미지가 선택되었습니다
          </p>
        )}
      </div>

      <div className="shrink-0 space-y-2.5 px-5 pb-8">
        <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
          {isUploading ? "업로드 중..." : "변경하기"}
        </Button>
      </div>
    </div>
  );
}
