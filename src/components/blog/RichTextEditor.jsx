import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "link"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["image"],
    ["clean"],
  ],
};

const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "link", "list", "image"];

export default function RichTextEditor({ value, onChange, placeholder = "Write your blog content here..." }) {
  const [mode, setMode] = useState("editor");

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex gap-1 border-b border-slate-200 bg-slate-50 p-2">
        {[["editor", "Editor"], ["preview", "Preview"]].map(([key, label]) => <button key={key} type="button" onClick={() => setMode(key)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${mode === key ? "bg-white text-[#8700ff] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>)}
      </div>
      {mode === "editor" ? <div className="rich-text-editor [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[400px] [&_.ql-editor]:px-5 [&_.ql-editor]:py-4 [&_.ql-editor]:text-base [&_.ql-editor]:leading-7 [&_.ql-editor_ol]:pl-6 [&_.ql-editor_ul]:pl-6"><ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} formats={formats} placeholder={placeholder} /></div> : <div className="blog-content min-h-[400px] px-5 py-4 text-slate-800" dangerouslySetInnerHTML={{ __html: value || "<p>Preview will appear here…</p>" }} />}
    </div>
  );
}
