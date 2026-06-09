// プロンプト本文中の {変数} を扱うユーティリティ。

/** {token} を出現順・重複なしで取り出す。 */
export function extractVars(text: string): string[] {
  const out: string[] = [];
  const re = /\{([^}]+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const name = m[1].trim();
    if (name && !out.includes(name)) out.push(name);
  }
  return out;
}

/** {token} を values[token] で置換。未入力の変数は {token} のまま残す。 */
export function fillVars(text: string, values: Record<string, string>): string {
  return text.replace(/\{([^}]+)\}/g, (whole, raw) => {
    const name = String(raw).trim();
    const v = values[name];
    return v && v.length > 0 ? v : whole;
  });
}
