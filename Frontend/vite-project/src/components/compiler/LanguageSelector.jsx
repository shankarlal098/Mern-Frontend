import React, { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "c", name: "C" },
];

export default function LanguageSelector({ language, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div className="relative z-30" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-slate-700 hover:bg-slate-800 active:scale-95"
      >
        <span className="capitalize">{selectedLang.name}</span>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-400" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-slate-800 bg-[#0d1117] p-1.5 shadow-2xl backdrop-blur-xl z-1000">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                onChange(lang.id);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                language === lang.id
                  ? "bg-blue-600/20 text-blue-400 font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <span>{lang.name}</span>
              {language === lang.id && (
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}