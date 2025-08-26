import { useEffect, useState } from "react";
import { listStrings, addString, removeStringByValue } from "../../Service/APIservice";

export default function Banner() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await listStrings();
      if (res.success) setItems(res.data);
      else setError(res.error);
    })();
  }, []);

  const handleAdd = async () => {
    setError("");
    if (!text.trim()) return setError("Please paste an image URL.");
    try {
      new URL(text); // basic URL validation
    } catch {
      return setError("Invalid URL.");
    }
    const res = await addString(text.trim());
    if (res.success) {
      setItems(res.data);
      setText("");
    } else setError(res.error);
  };

  const handleRemove = async (t) => {
    const res = await removeStringByValue(t);
    if (res.success) setItems(res.data.storage);
    else setError(res.error);
  };



  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-[92%] max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Image URL Library</h1>
            <p className="text-sm text-slate-500">Add, preview, and remove image URLs.</p>
          </div>
     
         
        </div>

        {/* Input row */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 active:scale-[.98]"
            >
              Add
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-rose-600">
              {error}
            </p>
          )}
        </div>

        {/* Grid */}
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No images yet. Paste a URL above and click <span className="font-medium text-slate-700">Add</span>.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((url, i) => (
              <li key={`${url}-${i}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-slate-100">
                  {/* Image preview with fallback */}
                  <img
                    src={url}
                    alt={`img-${i}`}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.src = "data:image/svg+xml;utf8,\
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'>\
                      <rect width='200' height='150' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='14'>Preview failed</text></svg>"; }}
                  />
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-1 text-xs text-slate-700 shadow hover:bg-white"
                  >
                    Open
                  </a>
                </div>

                <div className="flex items-start justify-between gap-2 p-3">
                  <p className="line-clamp-2 w-full pr-2 text-xs text-slate-600">{url}</p>
                  <button
                    onClick={() => handleRemove(url)}
                    className="shrink-0 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
