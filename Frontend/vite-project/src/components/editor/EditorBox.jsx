import Editor from "@monaco-editor/react";

export default function EditorBox({
  language,
  code,
  onChange,
  onMount,
  canEdit,
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-5 py-3">

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>

        <span className="text-sm font-medium uppercase tracking-wide text-gray-400">
          {language}
        </span>

      </div>

      {/* Monaco */}
      <div className="h-[400px] md:h-[550px] w-full">

        <Editor
          height="100%"
          width="100%"
          language={language}
          value={code}
          onChange={onChange}
          onMount={onMount}
          theme="vs-dark"
          options={{
            readOnly: !canEdit,

            fontSize: 15,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', monospace",

            minimap: {
              enabled: false,
            },

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

            padding: {
              top: 16,
              bottom: 16,
            },
          }}
        />

      </div>

    </div>
  );
}

//  theme="vs-dark"
              // options={{
              //   fontSize: 14,
              //   minimap: { enabled: false },
              //   tabSize: 2,
              //   insertSpaces: true,
              //   wordWrap: 'on',
              //   lineNumbers: 'on',
              //   folding: true,
              //   automaticLayout: true,
              //   scrollBeyondLastLine: false,
              //   renderLineHighlight: 'line',
              //   padding: { top: 10, bottom: 10 }
              // }}

          //      options={{
          //   fontSize: 15,
          //   minimap: { enabled: false },
          //   scrollBeyondLastLine: false,
          //   automaticLayout: true,
          //   tabSize: 2,
          //   insertSpaces: true,
          //   wordWrap: "on",
          //   lineNumbers: "on",
          //   folding: true,
          //   mouseWheelZoom: true,
          //   cursorSmoothCaretAnimation: "on",
          //   smoothScrolling: true,
          //   renderLineHighlight: "all",
          //   selectionHighlight: true,
          //   occurrencesHighlight: "multiFile",
          //   bracketPairColorization: {
          //     enabled: true
          //   },
          //   guides: {
          //     indentation: true,
          //     bracketPairs: true
          //   },
          //   padding: {
          //     top: 10,
          //     bottom: 10
          //   },
          //   scrollbar: {
          //     vertical: "auto",
          //     horizontal: "auto",
          //     useShadows: false
          //   },
          //   contextmenu: true,
          //   formatOnPaste: true,
          //   formatOnType: true,
          //   readOnly: !canEdit
          // }}