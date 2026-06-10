// HTML email builder: assemble email-safe blocks (table-based, inline CSS,
// 600px, web-safe fonts) into a full newsletter. Blocks consume shared fields.

export type EmailFields = {
  brandColor: string;
  companyName: string;
  subject: string;
  preheader: string;
  heading: string;
  bodyText: string;
  bodyText2: string;
  ctaText: string;
  ctaUrl: string;
  footerNote: string;
  /** 画像ブロック用。空なら画像ブロックは描画されない */
  imageUrl: string;
  imageAlt: string;
  /** SNSリンク。1行1リンク「ラベル URL」（例: X https://x.com/yourname） */
  socialLinks: string;
};

export const DEFAULT_FIELDS: EmailFields = {
  brandColor: "#1d4ed8",
  companyName: "Your Company",
  subject: "【ご案内】新サービスのお知らせ",
  preheader: "本文の冒頭に表示されるプレヘッダーテキストです。",
  heading: "見出しをここに",
  bodyText:
    "ここに本文が入ります。読み手にとっての価値を、結論から簡潔に伝えましょう。",
  bodyText2:
    "補足の段落です。具体例や数字を添えると説得力が増します。",
  ctaText: "詳しく見る",
  ctaUrl: "https://example.com",
  footerNote: "本メールは配信を希望された方へお送りしています。",
  imageUrl: "",
  imageAlt: "",
  socialLinks: "X https://x.com/yourname\nInstagram https://instagram.com/yourname",
};

export const EMAIL_BLOCKS: { id: string; label: string }[] = [
  { id: "header",    label: "ロゴヘッダー" },
  { id: "hero",      label: "ヒーロー（見出し＋本文＋CTA）" },
  { id: "image",     label: "画像" },
  { id: "body",      label: "本文ブロック" },
  { id: "highlight", label: "ハイライトボックス（引用・強調）" },
  { id: "feature2",  label: "2カラム特徴紹介" },
  { id: "numlist",   label: "番号付きリスト" },
  { id: "button",    label: "ボタン CTA" },
  { id: "divider",   label: "区切り線" },
  { id: "socialfooter", label: "SNSリンク" },
  { id: "footer",    label: "フッター（配信停止）" },
];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const nl2br = (s: string) => esc(s).replace(/\n/g, "<br/>");

const FONT =
  "-apple-system,BlinkMacSystemFont,'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,Arial,sans-serif";

function button(f: EmailFields): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto"><tr><td style="border-radius:6px;background:${f.brandColor}">
    <a href="${esc(f.ctaUrl)}" style="display:inline-block;padding:14px 32px;font-family:${FONT};font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px">${esc(f.ctaText)} →</a>
  </td></tr></table>`;
}

export function renderBlock(id: string, f: EmailFields): string {
  switch (id) {
    case "header":
      return `<tr><td style="padding:24px 32px;text-align:center;border-bottom:3px solid ${f.brandColor}">
        <span style="font-family:${FONT};font-size:20px;font-weight:800;letter-spacing:.04em;color:#1a1a1a">${esc(f.companyName)}</span>
      </td></tr>`;
    case "hero":
      return `<tr><td style="padding:36px 32px 8px">
        <h1 style="margin:0 0 16px;font-family:${FONT};font-size:24px;line-height:1.4;font-weight:800;color:#1a1a1a">${nl2br(f.heading)}</h1>
        <p style="margin:0 0 24px;font-family:${FONT};font-size:15px;line-height:1.9;color:#444">${nl2br(f.bodyText)}</p>
        ${button(f)}
      </td></tr>`;
    case "image":
      if (!f.imageUrl.trim()) return "";
      return `<tr><td style="padding:16px 32px">
        <img src="${esc(f.imageUrl.trim())}" alt="${esc(f.imageAlt)}" width="536" style="display:block;width:100%;max-width:536px;height:auto;border-radius:8px"/>
      </td></tr>`;
    case "body":
      return `<tr><td style="padding:16px 32px">
        <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.9;color:#444">${nl2br(f.bodyText2)}</p>
      </td></tr>`;
    case "button":
      return `<tr><td style="padding:20px 32px;text-align:center">${button(f)}</td></tr>`;
    case "divider":
      return `<tr><td style="padding:8px 32px"><div style="height:1px;background:#e5e7eb"></div></td></tr>`;
    case "highlight":
      return `<tr><td style="padding:8px 32px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:18px 22px;border-left:4px solid ${f.brandColor};background:#f8f9ff;border-radius:0 8px 8px 0">
            <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.8;color:#1a1a1a;font-style:italic">${nl2br(f.bodyText2)}</p>
          </td></tr>
        </table>
      </td></tr>`;
    case "feature2":
      return `<tr><td style="padding:16px 32px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="48%" style="padding:16px;background:#f8f9ff;border-radius:10px;vertical-align:top">
              <p style="margin:0 0 8px;font-family:${FONT};font-size:15px;font-weight:700;color:${f.brandColor}">✓ 特徴 1</p>
              <p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.7;color:#444">${nl2br(f.bodyText)}</p>
            </td>
            <td width="4%"></td>
            <td width="48%" style="padding:16px;background:#f8f9ff;border-radius:10px;vertical-align:top">
              <p style="margin:0 0 8px;font-family:${FONT};font-size:15px;font-weight:700;color:${f.brandColor}">✓ 特徴 2</p>
              <p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.7;color:#444">${nl2br(f.bodyText2)}</p>
            </td>
          </tr>
        </table>
      </td></tr>`;
    case "numlist":
      return `<tr><td style="padding:16px 32px">
        ${f.bodyText.split("\n").filter(Boolean).map((line, i) =>
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px">
            <tr>
              <td width="32" style="vertical-align:top;padding-top:2px">
                <span style="display:inline-block;width:26px;height:26px;border-radius:50%;background:${f.brandColor};text-align:center;font-family:${FONT};font-size:13px;font-weight:700;color:#fff;line-height:26px">${i+1}</span>
              </td>
              <td style="font-family:${FONT};font-size:14px;line-height:1.7;color:#333;padding-left:10px">${esc(line)}</td>
            </tr>
          </table>`
        ).join("")}
      </td></tr>`;
    case "socialfooter": {
      const links = f.socialLinks
        .split(/\r?\n/)
        .map((line) => {
          const sp = line.trim().split(/\s+/);
          const url = sp.find((t) => /^https?:\/\//.test(t));
          if (!url) return null;
          const label = sp.filter((t) => t !== url).join(" ") || url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
          return `<a href="${esc(url)}" style="font-family:${FONT};font-size:13px;font-weight:700;color:${f.brandColor};text-decoration:none">${esc(label)}</a>`;
        })
        .filter(Boolean);
      if (links.length === 0) return "";
      return `<tr><td style="padding:18px 32px;text-align:center">
        ${links.join(`<span style="font-family:${FONT};color:#ccc">　·　</span>`)}
      </td></tr>`;
    }
    case "footer":
      return `<tr><td style="padding:28px 32px;background:#f6f7f9;text-align:center">
        <p style="margin:0 0 8px;font-family:${FONT};font-size:12px;line-height:1.7;color:#888">${nl2br(f.footerNote)}</p>
        <p style="margin:0;font-family:${FONT};font-size:12px;color:#aaa">© ${new Date().getFullYear()} ${esc(f.companyName)}　|　<a href="#" style="color:#888">配信停止</a></p>
      </td></tr>`;
    default:
      return "";
  }
}

export function buildEmailHtml(orderIds: string[], f: EmailFields): string {
  const rows = orderIds.map((id) => renderBlock(id, f)).join("\n");
  return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(f.subject)}</title></head>
<body style="margin:0;padding:0;background:#eef1f5">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(f.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f5">
  <tr><td align="center" style="padding:24px 12px">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06)">
${rows}
    </table>
  </td></tr>
</table>
</body></html>`;
}
