import Editor from "@monaco-editor/react";

export default function EditorBox({
  language,
  code,
  onChange,
  onMount,
  canEdit,
}) {
  // Monaco mount hone par custom sleek theme configuration
  function handleEditorDidMount(editor, monaco) {
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0d1117",
        "editor.lineHighlightBackground": "#161b22",
        "editorGutter.background": "#0d1117",
        "editorCursor.foreground": "#58a6ff",
        "editor.selectionBackground": "#264f78",
      },
    });
    monaco.editor.setTheme("custom-dark");

    if (onMount) onMount(editor);
  }

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-[#0d1117] shadow-2xl transition-all">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
        </div>

        <div className="flex items-center gap-2">
          {!canEdit && (
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
              Read Only
            </span>
          )}
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
            {language}
          </span>
        </div>
      </div>

      {/* Monaco Container - Removed overflow-hidden to fix scroll issues */}
      <div className="h-[450px] md:h-[600px] w-full relative">
        <Editor
          height="100%"
          width="100%"
          language={language}
          value={code}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly: !canEdit,
            fontSize: 14,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace",
            minimap: { enabled: false },
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            lineNumbers: "on",
            folding: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderLineHighlight: "all",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              useShadows: false,
            },
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
}