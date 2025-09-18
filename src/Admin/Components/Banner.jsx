// components/Banner.jsx
import { useEffect, useState } from "react";
import { listBanners, createBanner, updateBanner } from "../../Service/APIservice";

// --- Custom Hook for loading states ---
const useLoading = () => {
  const [loading, setLoading] = useState(new Set());

  const isLoading = (key) => loading.has(key);

  const startLoading = (key) => setLoading((prev) => new Set(prev).add(key));

  const stopLoading = (key) =>
    setLoading((prev) => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });

  return { isLoading, startLoading, stopLoading };
};

// --- URL validation helper ---
const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

// --- Banner Card component ---
function BannerCard({
  item,
  isEditing,
  editingData,
  onStartEdit,
  onCancel,
  onEditChange,
  onSave,
  isLoading,
}) {
  const { _id, link, link2 } = item;
  const displayData = isEditing ? editingData : item;

  return (
    <li className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
      {/* Image Previews */}
      <div className="flex gap-2 p-3">
        {[displayData?.link || "", displayData?.link2 || ""].map((img, i) => (
          <div key={i} className="relative aspect-[4/3] flex-1 bg-slate-100 rounded-md overflow-hidden">
            <img
              src={img}
              alt={`banner-${_id}-${i}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'><rect width='200' height='150' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='14'>Preview failed</text></svg>";
              }}
            />
          </div>
        ))}
      </div>

      {/* Inputs and Actions */}
      <div className="flex flex-col gap-2 p-3 pt-0 mt-auto">
        {isEditing ? (
          <>
            <input
              className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
              value={editingData?.link || ""}
              onChange={(e) => onEditChange(_id, "link", e.target.value)}
              placeholder="https://new-url1..."
            />
            <input
              className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
              value={editingData?.link2 || ""}
              onChange={(e) => onEditChange(_id, "link2", e.target.value)}
              placeholder="https://new-url2..."
            />
            <div className="flex gap-2">
              <button
                onClick={() => onSave(_id)}
                disabled={isLoading(`save_${_id}`)}
                className="rounded-md bg-slate-900 px-3 py-1 text-xs text-white hover:bg-slate-800 disabled:bg-slate-400"
              >
                {isLoading(`save_${_id}`) ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => onCancel(_id)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="line-clamp-2 break-all text-xs text-slate-600">
              {link} <br /> {link2}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onStartEdit(_id, { link, link2 })}
                className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
}

// --- Main Banner Component ---
export default function Banner() {
  const [items, setItems] = useState([]);
  const [newLinks, setNewLinks] = useState({ link1: "", link2: "" });
  const [error, setError] = useState("");
  const [editing, setEditing] = useState({}); // { [id]: { link, link2 } }
  const { isLoading, startLoading, stopLoading } = useLoading();

  // Fetch banners on mount
  useEffect(() => {
    (async () => {
      startLoading("fetch");
      const res = await listBanners();
      if (res.success) setItems(res.data || []);
      else setError(res.error);
      stopLoading("fetch");
    })();
  }, []);

  // Add new banner
  const handleAdd = async () => {
    setError("");
    const { link1, link2 } = newLinks;
    if (!link1.trim() || !link2.trim()) return setError("Both image URLs are required.");
    if (!isValidUrl(link1) || !isValidUrl(link2)) return setError("One or more URLs are invalid.");

    startLoading("add");
    const res = await createBanner({ link: link1, link2: link2 });
    if (res.success) {
      setItems((prev) => [res.data, ...prev]);
      setNewLinks({ link1: "", link2: "" });
    } else setError(res.error);
    stopLoading("add");
  };

  const handleEditChange = (id, field, value) => {
    setEditing((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const saveEdit = async (id) => {
    setError("");
    const { link: newLink, link2: newLink2 } = editing[id] || {};
    if (!newLink?.trim() || !newLink2?.trim()) return setError("Both URLs are required when editing.");
    if (!isValidUrl(newLink) || !isValidUrl(newLink2)) return setError("One or more URLs are invalid.");

    startLoading(`save_${id}`);
    const res = await updateBanner(id, { link: newLink, link2: newLink2 });
    if (res.success) {
      setItems((prev) => prev.map((b) => (b._id === id ? res.data : b)));
      setEditing((e) => {
        const copy = { ...e };
        delete copy[id];
        return copy;
      });
    } else setError(res.error);
    stopLoading(`save_${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-[92%] max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Banner Images</h1>
          <p className="text-sm text-slate-500">
            Create, preview, and update banner image URLs (2 per banner).
          </p>
        </div>

        {/* Input Row */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row gap-2">
          <input
            value={newLinks.link1}
            onChange={(e) => setNewLinks((prev) => ({ ...prev, link1: e.target.value }))}
            placeholder="Paste first image URL"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <input
            value={newLinks.link2}
            onChange={(e) => setNewLinks((prev) => ({ ...prev, link2: e.target.value }))}
            placeholder="Paste second image URL"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button
            onClick={handleAdd}
            disabled={isLoading("add")}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:bg-slate-400 active:scale-[.98]"
          >
            {isLoading("add") ? "Adding..." : "Add"}
          </button>
        </div>

        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}

        {/* Banner Grid */}
        {isLoading("fetch") ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Loading banners...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No banners yet. Paste URLs above and click{" "}
            <span className="font-medium text-slate-700">Add</span>.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <BannerCard
                key={item._id}
                item={item}
                isEditing={editing[item._id] !== undefined}
                editingData={editing[item._id]}
                onStartEdit={(id, current) => setEditing((e) => ({ ...e, [id]: { ...current } }))}
                onCancel={(id) => setEditing((e) => { const copy = { ...e }; delete copy[id]; return copy; })}
                onEditChange={handleEditChange}
                onSave={saveEdit}
                isLoading={isLoading}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
