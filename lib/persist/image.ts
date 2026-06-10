// 画像の取り込み前圧縮。
// スクショ等を生 DataURL で IndexedDB に貯めると容量を急速に消費するため、
// canvas で長辺を抑えて再エンコードしてから保存する。

const MAX_EDGE = 1600; // 長辺の上限(px)。スワイプ用途では十分な解像度
const QUALITY = 0.82;

/**
 * File → 圧縮済み DataURL。
 * - 長辺 MAX_EDGE 超は縮小。WebP 対応ブラウザは WebP、なければ JPEG。
 * - GIF（アニメ保持不可のため）や処理失敗時は元の DataURL にフォールバック。
 */
export function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve("");
    reader.onload = () => {
      const raw = reader.result as string;
      // アニメGIFは canvas に通すと1コマ化するので素通し
      if (file.type === "image/gif") return resolve(raw);

      const img = new Image();
      img.onerror = () => resolve(raw);
      img.onload = () => {
        try {
          const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(raw);
          ctx.drawImage(img, 0, 0, w, h);

          const webp = canvas.toDataURL("image/webp", QUALITY);
          const out = webp.startsWith("data:image/webp")
            ? webp
            : canvas.toDataURL("image/jpeg", QUALITY);
          // 圧縮で逆に膨らんだ場合（小さなPNG等）は元を使う
          resolve(out.length < raw.length ? out : raw);
        } catch {
          resolve(raw);
        }
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  });
}
