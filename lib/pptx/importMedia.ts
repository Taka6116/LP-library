// 画像 / PDF を PPT Studio のデッキとして取り込むための変換層。
// すべて端末内処理（サーバ送信なし）。
// - 画像: png/jpeg/gif はそのまま、その他（webp等）は canvas で jpeg 化
// - PDF: pdfjs-dist で各ページをラスタライズして1ページ=1スライド
// 変換結果は buildPptxFromImages で本物の .pptx になり、既存パイプラインに乗る。

import { buildPptxFromImages, type SlideImage } from "./buildFromImages";

const PDF_RENDER_WIDTH = 1920; // ラスタライズ幅(px)
const PDF_MAX_PAGES = 100;

export function isImageFile(f: File): boolean {
  return /^image\//.test(f.type) || /\.(png|jpe?g|gif|webp|bmp)$/i.test(f.name);
}

export function isPdfFile(f: File): boolean {
  return f.type === "application/pdf" || /\.pdf$/i.test(f.name);
}

function loadImageEl(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

function canvasToSlide(canvas: HTMLCanvasElement): Promise<SlideImage> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("toBlob failed"));
        blob.arrayBuffer().then((data) =>
          resolve({ data, ext: "jpeg", width: canvas.width, height: canvas.height }),
        );
      },
      "image/jpeg",
      0.92,
    );
  });
}

/** 画像ファイル1つを SlideImage に変換する。 */
export async function imageFileToSlide(file: File): Promise<SlideImage> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageEl(url);
    const native =
      file.type === "image/png" ? "png" :
      file.type === "image/jpeg" ? "jpeg" :
      file.type === "image/gif" ? "gif" : null;

    if (native) {
      return {
        data: await file.arrayBuffer(),
        ext: native,
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
    }
    // webp / bmp 等は PowerPoint 互換のため jpeg に変換
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas unavailable");
    ctx.fillStyle = "#ffffff"; // 透過は白背景に
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    return canvasToSlide(canvas);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** PDF の全ページを SlideImage[] に変換する（pdfjs は使用時のみ動的ロード）。 */
export async function pdfToSlides(
  file: File,
  onProgress?: (done: number, total: number) => void,
): Promise<SlideImage[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data }).promise;
  const total = Math.min(doc.numPages, PDF_MAX_PAGES);
  const slides: SlideImage[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await doc.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const scale = PDF_RENDER_WIDTH / base.width;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas unavailable");
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    slides.push(await canvasToSlide(canvas));
    onProgress?.(i, total);
  }
  // 型定義に destroy が無いバージョンがあるため安全に呼ぶ（実行時には存在する）
  await (doc as unknown as { destroy?: () => Promise<void> }).destroy?.();
  return slides;
}

/** 画像ファイル群を1つの PPTX（1枚=1スライド）にまとめる。 */
export async function imagesToPptx(files: File[]): Promise<ArrayBuffer> {
  const slides: SlideImage[] = [];
  for (const f of files) slides.push(await imageFileToSlide(f));
  return buildPptxFromImages(slides);
}

/** PDF 1ファイルを PPTX に変換する。 */
export async function pdfToPptx(
  file: File,
  onProgress?: (done: number, total: number) => void,
): Promise<{ buf: ArrayBuffer; pages: number }> {
  const slides = await pdfToSlides(file, onProgress);
  return { buf: await buildPptxFromImages(slides), pages: slides.length };
}
