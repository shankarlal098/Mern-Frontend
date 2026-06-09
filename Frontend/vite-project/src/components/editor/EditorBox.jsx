



import Editor from "@monaco-editor/react";

export default function EditorBox({ language, code, onChange, onMount, canEdit }) {
  return (
    <div className="h-[400px] md:h-[550px] w-full bg-black rounded-2xl overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        onChange={onChange}
        onMount={onMount}
        theme="vs-dark"
          options={{
                fontSize: 14,
                minimap: { enabled: false },
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                renderLineHighlight: 'line',
                padding: { top: 10, bottom: 10 }
          }}
      />
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