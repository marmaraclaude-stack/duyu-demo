// Excel'in Türkçe karakterleri doğru açması için BOM + noktalı virgül ayracı.

function escapeCell(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  const s = String(value);
  if (/[";\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number | undefined | null)[][]
): void {
  const lines = [
    headers.map(escapeCell).join(";"),
    ...rows.map((r) => r.map(escapeCell).join(";")),
  ];
  const blob = new Blob(["﻿" + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
