"use client";
import { useEffect, useState } from 'react';
import html2canvas from "html2canvas-pro";

// CuteFormatterStarter.jsx
// Single-file starter React component (Tailwind CSS assumed) that provides:
// - Text input panel
// - Simple heuristic section parser (instant feedback)
// - Theme token system (CSS variables)
// - Per-section style editor
// - Live preview with per-section animations

// Usage: drop into a Next.js or Create React App project with Tailwind configured.

// ---------- Simple parser (heuristic fallback) ----------
function simpleParse(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim());
  const nonEmpty = lines.filter(Boolean);
  const result = { title: null, sections: [] };
  if (nonEmpty.length === 0) return result;

  // Title heuristic: first non-empty short line
  const first = nonEmpty[0];
  if (first.length < 80 && first.split(' ').length <= 8) {
    result.title = first;
    lines.splice(lines.indexOf(first), 1);
  }

  let buffer = [];
  const pushParagraph = () => {
    if (buffer.length) {
      result.sections.push({ id: `p_${result.sections.length + 1}`, type: 'paragraph', text: buffer.join(' ') });
      buffer = [];
    }
  };

  // detect numbered lists, bullet lists, blockquotes, code blocks
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line) { i++; continue; }
    // code block (```)
    if (line.startsWith('```')) {
      pushParagraph();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
      result.sections.push({ id: `code_${result.sections.length + 1}`, type: 'code', text: codeLines.join('\n') });
      i++; continue;
    }
    // blockquote
    if (line.startsWith('>')) {
      pushParagraph();
      result.sections.push({ id: `q_${result.sections.length + 1}`, type: 'quote', text: line.replace(/^>\s?/, '') });
      i++; continue;
    }
    // numbered list
    if (/^\d+\./.test(line)) {
      pushParagraph();
      const items = [];
      while (i < lines.length && /^\d+\./.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s*/, ''));
        i++;
      }
      result.sections.push({ id: `steps_${result.sections.length + 1}`, type: 'step_list', items });
      continue;
    }
    // bullet list
    if (/^[-*•]\s+/.test(line)) {
      pushParagraph();
      const items = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*•]\s+/, ''));
        i++;
      }
      result.sections.push({ id: `list_${result.sections.length + 1}`, type: 'list', items });
      continue;
    }
    // notes
    if (/^note[:\-]/i.test(line) || /^tip[:\-]/i.test(line)) {
      pushParagraph();
      result.sections.push({ id: `note_${result.sections.length + 1}`, type: 'note', text: line.replace(/^note[:\-]\s*/i, '') });
      i++; continue;
    }
    // default: accumulate paragraph lines until blank
    buffer.push(line);
    i++;
  }
  pushParagraph();
  return result;
}

// ---------- Theme token presets ----------
const THEME_PRESETS = {
  'pastel': {
    '--bg': 'linear-gradient(135deg, #FFF7FB, #F4F9FF)',
    '--card-bg': 'rgba(255,255,255,0.85)',
    '--accent': '#9C6ADE',
    '--muted': '#6B6B7A',
    '--font': "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'",
    '--glitter': '0.12'
  },
  'minimal': {
    '--bg': 'linear-gradient(180deg,#ffffff,#f6f7fb)',
    '--card-bg': 'white',
    '--accent': '#0f172a',
    '--muted': '#4b5563',
    '--font': "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto",
    '--glitter': '0'
  },
  'glitter': {
    '--bg': 'linear-gradient(135deg,#fff0f8,#f2fdff)',
    '--card-bg': 'rgba(255,255,255,0.9)',
    '--accent': '#ff6fb5',
    '--muted': '#5b5b6b',
    '--font': "'Poppins', system-ui, -apple-system, 'Segoe UI'",
    '--glitter': '0.35'
  }
};

// ---------- Per-section style presets ----------
const SECTION_STYLE_PRESETS = {
  'title': [
    { id: 't-1', label: 'Big & Cute', fontSize: '2.4rem', transform: 'none', animation: 'pop' },
    { id: 't-2', label: 'Elegant', fontSize: '1.8rem', transform: 'uppercase', animation: 'fade' }
  ],
  'paragraph': [
    { id: 'p-1', label: 'Soft', fontSize: '1rem', transform: 'none', animation: 'fade' },
    { id: 'p-2', label: 'Compact', fontSize: '0.9rem', transform: 'none', animation: 'slide' }
  ],
  'step_list': [
    { id: 's-1', label: 'Bubbly', fontSize: '1rem', transform: 'none', animation: 'stagger' },
    { id: 's-2', label: 'Numbered', fontSize: '0.98rem', transform: 'none', animation: 'slide' }
  ],
  'list': [
    { id: 'l-1', label: 'Dotty', fontSize: '1rem', transform: 'none', animation: 'fade' }
  ],
  'quote': [
    { id: 'q-1', label: 'Italic', fontSize: '1.05rem', transform: 'italic', animation: 'fade' }
  ],
  'code': [
    { id: 'c-1', label: 'Mono', fontSize: '0.9rem', transform: 'none', animation: 'fade' }
  ],
  'note': [
    { id: 'n-1', label: 'Badge', fontSize: '0.95rem', transform: 'none', animation: 'pop' }
  ]
};

// Helper to merge theme tokens into style object
function themeStyleFromTokens(tokens) {
  const style = {};
  Object.keys(tokens).forEach(k => { style[k] = tokens[k]; });
  return style;
}




// ---------- Main component ----------
export default function CuteFormatterStarter() {
  // console.log("COMPONENT RENDERED CLIENT-SIDE");
  async function downloadPDF() {
  console.log("PDF button clicked");

  const wrapper = document.getElementById("preview-root");
  if (!wrapper) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  :root {
    ${Object.entries(themeTokens).map(([k, v]) => `${k}: ${v};`).join("\n")}
  }
  body {
    background: var(--bg);
    font-family: var(--font);
    padding: 32px;
  }
</style>
</head>
<body>
${wrapper.innerHTML}
</body>
</html>
`;

  const formData = new FormData();
  formData.append("html", html);

  console.log("Sending PDF request...");

  const res = await fetch("/api/export-pdf", {
    method: "POST",
    body: formData,
  });

  console.log("PDF response status:", res.status);

  if (!res.ok) {
    alert("PDF generation failed");
    return;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cute-output.pdf";
  a.click();

  URL.revokeObjectURL(url);
}


  async function downloadPNG() {
    const preview = document.getElementById("preview-root");
    if (!preview) return;

    const canvas = await html2canvas(preview, {
      scale: 2, // higher resolution
      backgroundColor: null
    });

    const url = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = url;
    a.download = "cute-output.png";
    a.click();
  }
  function downloadHTML() {
    const wrapper = document.getElementById("preview-root");
    if (!wrapper) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Formatted Output</title>
<style>
  :root {
    ${Object.entries(themeTokens)
        .map(([k, v]) => `${k}: ${v};`)
        .join("\n")}
  }
  body {
    font-family: ${themeTokens["--font"]};
    background: ${themeTokens["--bg"]};
    padding: 20px;
  }
</style>
</head>
<body>
${wrapper.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "cute-output.html";
    a.click();

    URL.revokeObjectURL(url);
  }

  async function handleSmartParse() {
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input })
      });

      const data = await res.json();

      if (data.ast) {
        setAst(data.ast);
      } else {
        alert("Parse error: " + data.error);
      }
    } catch (err) {
      alert("Network or server error");
    }
  }
  const [input, setInput] = useState(`Project Plan\n1. Design UI\n2. Build auth\n3. Launch\n\nNote: remember accessibility checks.`);
  const [ast, setAst] = useState(() => simpleParse(input));
  const [themeName, setThemeName] = useState('pastel');
  const [themeTokens, setThemeTokens] = useState(THEME_PRESETS[themeName]);
  const [sectionStyles, setSectionStyles] = useState({});

  // parse on input change (debounced)
  useEffect(() => {
    const t = setTimeout(() => { setAst(simpleParse(input)); }, 180);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => { setThemeTokens(THEME_PRESETS[themeName]); }, [themeName]);

  useEffect(() => {
    // initialize per-section defaults when AST changes
    const defaults = {};
    if (ast.title) defaults.title = SECTION_STYLE_PRESETS.title[0].id;
    ast.sections.forEach(s => {
      if (!defaults[s.type]) {
        const presets = SECTION_STYLE_PRESETS[s.type] || SECTION_STYLE_PRESETS.paragraph;
        defaults[s.type] = presets[0].id;
      }
    });
    setSectionStyles(prev => ({ ...defaults, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ast.title, ast.sections.length]);

  // apply CSS variables to wrapper
  const rootStyle = Object.fromEntries(Object.entries(themeTokens).map(([k, v]) => [k, v]));

  // small helpers to resolve style preset to inline style
  function resolvePresetFor(sectionType) {
    const presetId = sectionStyles[sectionType];
    const list = SECTION_STYLE_PRESETS[sectionType] || SECTION_STYLE_PRESETS.paragraph;
    return list.find(p => p.id === presetId) || list[0];
  }

  // Render preview pieces
  function renderSection(s) {
    const preset = resolvePresetFor(s.type) || {};
    const common = {
      fontSize: preset.fontSize,
      fontStyle: preset.transform === 'italic' ? 'italic' : 'normal',
      textTransform: preset.transform === 'uppercase' ? 'uppercase' : 'none'
    };

    const animationClass = preset.animation === 'pop' ? 'animate-pop' : preset.animation === 'slide' ? 'animate-slide' : preset.animation === 'stagger' ? 'animate-stagger' : 'animate-fade';

    switch (s.type) {
      case 'paragraph': return <p key={s.id} className={`mb-3 ${animationClass}`} style={common}>{s.text}</p>;
      case 'quote': return <blockquote key={s.id} className={`mb-3 p-3 rounded border-l-4 ${animationClass}`} style={{ ...common, borderColor: 'var(--accent)' }}>{s.text}</blockquote>;
      case 'code': return <pre key={s.id} className={`mb-3 p-3 rounded bg-gray-900 text-white overflow-auto ${animationClass}`} style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace', ...common }}><code>{s.text}</code></pre>;
      case 'list': return <ul key={s.id} className={`${animationClass} list-disc pl-6 mb-3`} style={common}>{s.items.map((it, idx) => <li key={idx}>{it}</li>)}</ul>;
      case 'step_list': return <ol key={s.id} className={`${animationClass} list-decimal pl-6 mb-3`} style={common}>{s.items.map((it, idx) => <li key={idx}>{it}</li>)}</ol>;
      case 'note': return <div key={s.id} className={`${animationClass} inline-block px-3 py-1 rounded-full text-sm`} style={{ background: 'var(--accent)', color: 'white', ...common }}>{s.text}</div>;
      default: return <p key={s.id} className={`${animationClass} mb-3`} style={common}>{s.text}</p>;
    }
  }

  // small export: copy HTML to clipboard
  async function exportHTML() {
    const wrapper = document.getElementById('preview-root');
    if (!wrapper) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${wrapper.innerHTML}</body></html>`;
    try {
      await navigator.clipboard.writeText(html);
      alert('Preview HTML copied to clipboard (paste into an HTML file).');
    } catch (e) { alert('Copy failed.'); }
  }

  return (
    <div className="min-h-screen p-6" style={rootStyle}>
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left: Input + Controls */}
        <div className="col-span-4">
          <div className="p-4 rounded-xl bg-white/70 backdrop-blur-md float-soft">
            <label className="block text-black text-sm font-medium mb-1">Input Text</label>
            <textarea value={input} onChange={e => setInput(e.target.value)} className="text-black w-full h-48 p-3 rounded border focus:outline-none" />
          </div>

          <div className="p-4 rounded-xl bg-black/70 backdrop-blur-md float-soft">
            <label className="block text-sm text-white font-medium mb-1">Theme</label>
            <select value={themeName} onChange={e => setThemeName(e.target.value)} className="w-full p-2 rounded border">
              {Object.keys(THEME_PRESETS).map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <div className="mt-3 text-xs text-white-600">Adjust tokens</div>
            <div className="mt-2 space-y-2">
              {Object.keys(themeTokens).map(key => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-28 text-xs">{key}</div>
                  <input className="flex-1 p-1 rounded border" value={themeTokens[key]} onChange={e => setThemeTokens(prev => ({ ...prev, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/70 backdrop-blur-md float-soft">
            <h3 className="text-sm text-black font-medium mb-2">Detected Sections</h3>
            <div className="text-sm text-gray-700 mb-2">Title: <span className="font-semibold">{ast.title || '—'}</span></div>
            <div className="space-y-2">
              {ast.sections.map(s => (
                <div key={s.id} className="p-2 border rounded bg-white">
                  <div className="text-xs text-gray-500">{s.type}</div>
                  <div className="text-sm text-black mt-1">{s.text ? (s.text.length > 80 ? s.text.slice(0, 80) + '...' : s.text) : (s.items ? s.items.join(', ') : '')}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={exportHTML} className="px-3 py-2 bg-indigo-600 text-white rounded">Copy HTML</button>
            <button onClick={() => { navigator.clipboard.writeText(input); alert('Input copied'); }} className="text-black bg-cyan-600 px-3 py-2 border rounded">Copy Input</button>
            <button onClick={handleSmartParse} className="mt-2 px-3 py-2 bg-purple-600 text-white rounded"> Smart Parse (LLM) </button>
            <button
              onClick={downloadHTML}
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              Download HTML
            </button>
            <button
              onClick={downloadPNG}
              className="px-3 py-2 bg-pink-600 text-white rounded"
            >
              Download PNG
            </button>
            <button
              onClick={downloadPDF}
              className="px-3 py-2 bg-red-600 text-white rounded"
            >
              Download PDF
            </button>

          </div>
        </div>

        {/* Middle: Per-section Style Editor */}
        <div className="col-span-4">
          <div className="bg-black/60 p-4 rounded shadow">
            <h3 className="font-medium mb-3">Per-section Style Editor</h3>
            <div className="space-y-4">
              {/* Title */}
              {ast.title && (
                <div>
                  <div className="text-xs text-gray-500">Title Style</div>
                  <select value={sectionStyles.title || ''} onChange={(e) => setSectionStyles(prev => ({ ...prev, title: e.target.value }))} className="w-full p-2 rounded border mt-1">
                    {SECTION_STYLE_PRESETS.title.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
              )}

              {/* dynamic list based on detected types */}
              {Array.from(new Set(ast.sections.map(s => s.type))).map(type => (
                <div key={type}>
                  <div className="text-xs text-gray-500 capitalize">{type} style</div>
                  <select value={sectionStyles[type] || ''} onChange={(e) => setSectionStyles(prev => ({ ...prev, [type]: e.target.value }))} className="w-full p-2 rounded border mt-1">
                    {(SECTION_STYLE_PRESETS[type] || SECTION_STYLE_PRESETS.paragraph).map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Tip: tweak theme tokens and section presets to quickly iterate. Later you can replace the parser with an LLM call for robust detection.
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="col-span-4 ">
          <div id="preview-root" className="p-6 backdrop-blur-md float-soft rounded-lg shadow-lg" style={{ background: 'var(--bg)', fontFamily: 'var(--font)' }}>
            <div className="max-w-2xl mx-auto text-black" style={{ background: 'var(--card-bg)', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(16,24,40,0.08)' }}>
              {ast.title && <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)', fontSize: resolvePresetFor('title')?.fontSize }}>{ast.title}</h1>}

              <div>
                {ast.sections.map(s => renderSection(s))}
              </div>

              <div className="mt-4 text-xs text-gray-500">Preview • Theme: {themeName}</div>
            </div>
          </div>

          {/* Glitter overlay controlled by token (simple) */}
          <div aria-hidden className="pointer-events-none">
            <div style={{ position: 'absolute', inset: 0, opacity: themeTokens['--glitter'] || 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '10px 10px', mixBlendMode: 'screen' }} />
          </div>
        </div>
      </div>

      {/* animations (tiny) */}
      <style>{`
        @keyframes pop { 0%{ transform: scale(.98); opacity:0 } 60%{ transform: scale(1.02); opacity:1 } 100%{ transform: scale(1); } }
        @keyframes slide { 0%{ transform: translateY(8px); opacity:0 } 100%{ transform: translateY(0); opacity:1 } }
        @keyframes fade { 0%{ opacity:0 } 100%{ opacity:1 } }
        .animate-pop{ animation: pop .48s cubic-bezier(.2,.8,.2,1) both }
        .animate-slide{ animation: slide .42s cubic-bezier(.2,.8,.2,1) both }
        .animate-fade{ animation: fade .36s linear both }
        /* stagger simple implementation */
        .animate-stagger > *{ opacity:0; transform: translateY(6px); animation: fade .4s linear both; animation-delay: calc(var(--i,0) * 60ms); }
      `}</style>
    </div>
  );
}
