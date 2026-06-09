"use client";

import { useRef, useState } from "react";
import { Button, Modal, useToast } from "./ui";
import { IconUpload, IconDownload } from "./icons";
import {
  exportAll, downloadBackup, parseBackup, importAll, type Backup, type ImportMode,
} from "@/lib/persist/backup";

/**
 * 全資産のバックアップ（エクスポート）と復元（インポート）。
 * すべてブラウザ内で完結し、サーバ不要で動作する。
 */
export function BackupControls() {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Backup | null>(null);

  async function onExport() {
    setBusy(true);
    try {
      const b = await exportAll();
      downloadBackup(b);
      const n = Object.keys(b.local).length + b.swipe.length + b.decks.length;
      toast.success(`バックアップを書き出しました（${n}件）`);
    } catch {
      toast.error("バックアップの書き出しに失敗しました");
    } finally {
      setBusy(false);
    }
  }

  function onPickFile() {
    fileRef.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // 同じファイルを再選択できるように
    if (!file) return;
    try {
      const text = await file.text();
      setPending(parseBackup(text));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ファイルを読み込めませんでした");
    }
  }

  async function doImport(mode: ImportMode) {
    if (!pending) return;
    setBusy(true);
    try {
      await importAll(pending, mode);
      toast.success("復元しました。再読み込みします…");
      setPending(null);
      window.setTimeout(() => window.location.reload(), 800);
    } catch {
      toast.error("復元に失敗しました");
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" loading={busy} onClick={onExport} leftIcon={<IconDownload className="h-4 w-4" />}>
          バックアップ
        </Button>
        <Button variant="ghost" size="sm" onClick={onPickFile} leftIcon={<IconUpload className="h-4 w-4" />}>
          復元
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={onFile}
          className="hidden"
          aria-hidden
        />
      </div>

      <Modal
        open={!!pending}
        onClose={() => setPending(null)}
        title="バックアップから復元"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setPending(null)}>キャンセル</Button>
            <Button variant="secondary" size="sm" loading={busy} onClick={() => doImport("merge")}>追記（マージ）</Button>
            <Button variant="danger" size="sm" loading={busy} onClick={() => doImport("replace")}>置き換え</Button>
          </>
        }
      >
        {pending && (
          <div className="space-y-3 text-sm">
            <p className="text-surface-fg">
              書き出し日時: <strong>{new Date(pending.exportedAt).toLocaleString("ja-JP")}</strong>
            </p>
            <ul className="space-y-1 text-surface-muted">
              <li>• localStorage: {Object.keys(pending.local).length} キー</li>
              <li>• Swipe（参考/画像）: {pending.swipe.length} 件</li>
              <li>• PPT デッキ: {pending.decks.length} 件</li>
            </ul>
            <div className="rounded-[var(--radius-sm)] border border-amber-300/50 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
              「追記」は既存データに足します。「置き換え」は<strong>現在のブラウザ内データを全て削除</strong>してから復元します（取り消せません）。
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
