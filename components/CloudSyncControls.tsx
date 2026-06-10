"use client";

import { useState } from "react";
import { Button, Modal, useToast } from "./ui";
import { IconRepeat } from "./icons";
import { cloudConfigured, syncPush, syncPull } from "@/lib/cloud/sync";

/**
 * クラウド同期の入口（シェル）。
 * バックエンド/アカウント未接続のため、現状は「未設定」を明示して動作しない。
 * 将来 Supabase 等を接続すれば push/pull がそのまま有効化される。
 */
export function CloudSyncControls() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const configured = cloudConfigured();

  async function run(dir: "push" | "pull") {
    setBusy(true);
    const res = dir === "push" ? await syncPush() : await syncPull();
    setBusy(false);
    if (res.ok) toast.success("同期しました");
    else toast.error(res.error);
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} leftIcon={<IconRepeat className="h-4 w-4" />}>
        クラウド同期
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="クラウド同期"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>閉じる</Button>
            <Button variant="secondary" size="sm" loading={busy} disabled={!configured} onClick={() => run("pull")}>
              取り込み
            </Button>
            <Button variant="primary" size="sm" loading={busy} disabled={!configured} onClick={() => run("push")}>
              アップロード
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <p className="text-surface-fg">
            複数端末・チームで資産を共有するためのクラウド同期です。
          </p>
          <div
            className={
              configured
                ? "rounded-[var(--radius-sm)] border border-success/40 bg-success/10 px-3 py-2 text-xs text-surface-fg"
                : "rounded-[var(--radius-sm)] border border-amber-300/50 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300"
            }
          >
            {configured
              ? "クラウド接続が有効です。"
              : "現在は未設定です。クラウド同期にはアカウント連携とバックエンド（例: Supabase）の接続が必要です。今は「バックアップ／復元」で端末間移行できます。"}
          </div>
        </div>
      </Modal>
    </>
  );
}
