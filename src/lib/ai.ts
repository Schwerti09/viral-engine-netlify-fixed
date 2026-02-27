/**
 * Minimaler, deterministischer "KI"-Stub:
 * - Ersetzt du später durch echten Provider (OpenAI, Anthropic, local LLM, etc.)
 * - Interface bleibt stabil.
 */
export type IdeaDraft = {
  hook: string;
  script: string;
  shotlist: string;
  viralScore: number;
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export async function generateIdea(prompt: string, voice: string): Promise<IdeaDraft> {
  const h = hash(prompt + voice);
  const score = 55 + (h % 40); // 55..94
  const hook = `Mythos-Alarm: ${prompt.replace(/[.?!]+$/,"")} — in 15 Sekunden entwirrt.`;
  const script =
    `Hook (0-2s): "${prompt}"\n` +
    `Kontext (2-6s): 1 Satz, warum das Thema triggert.\n` +
    `Erklärung (6-14s): 2-3 knackige Punkte, ohne Schwurbel.\n` +
    `Proof-Nugget (14-18s): Mini-Fakt / Studie / Mechanismus.\n` +
    `Twist (18-22s): Unerwartete Konsequenz.\n` +
    `CTA (22-25s): "Soll ich Teil 2 machen?"\n\n` +
    `Ton: ${voice}`;
  const shotlist =
    `1) Close-up, Textoverlay: "${prompt}"\n` +
    `2) Cut zu Skizze/Diagramm (1 Icon pro Punkt)\n` +
    `3) Pattern interrupt (Zoom / Jumpcut)\n` +
    `4) Abschluss mit CTA + Kommentar-Pin`;
  return { hook, script, shotlist, viralScore: score };
}
