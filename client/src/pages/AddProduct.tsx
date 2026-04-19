import { useRef, useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CATEGORIES } from "@/data/products";

// ─── Shared input style ───────────────────────────────────────────────────────

function useField(init = "") {
  const [value, setValue] = useState(init);
  const [focused, setFocused] = useState(false);
  return { value, setValue, focused, setFocused };
}

function inputStyle(focused: boolean, error?: boolean): React.CSSProperties {
  return {
    width: "100%", fontFamily: "'Poppins',sans-serif", fontSize: 14,
    color: "#3d2b1f", background: focused ? "#fff" : "#fdf4e7",
    border: `1.5px solid ${error ? "#e07a8a" : focused ? "#f4a7b9" : "rgba(196,164,132,0.3)"}`,
    borderRadius: 14, padding: "13px 16px", outline: "none",
    boxShadow: focused ? "0 0 0 3px rgba(244,167,185,0.15)" : "none",
    transition: "all 220ms ease", boxSizing: "border-box",
  };
}

// ─── Label ────────────────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
      color: "#3d2b1f", marginBottom: 6, display: "block" }}>
      {children}
      {required && <span style={{ color: "#f4a7b9", marginLeft: 3 }}>*</span>}
    </label>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11.5,
    color: "#e07a8a", margin: "5px 0 0" }}>{msg}</p>;
}

// ─── Image upload area ────────────────────────────────────────────────────────

function ImageUpload({ images, onChange }: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange([...images, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div>
      <input
        ref={fileRef} type="file" accept="image/*,video/*" multiple
        style={{ display: "none" }}
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />

      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragging ? "#f4a7b9" : "rgba(196,164,132,0.35)"}`,
          borderRadius: 18, padding: "28px 20px", textAlign: "center",
          cursor: "pointer", background: dragging ? "rgba(244,167,185,0.06)" : "#fdf4e7",
          transition: "all 200ms ease",
        }}
      >
        <div style={{ width: 48, height: 48, borderRadius: "50%",
          background: "rgba(244,167,185,0.15)", margin: "0 auto 12px",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#c4a484" strokeWidth="1.8" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
          color: "#3d2b1f", margin: "0 0 4px" }}>
          Drag & drop or click to upload
        </p>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#a08070", margin: 0 }}>
          Images or video · Multiple files allowed
        </p>
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          {images.map((src, i) => (
            <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
              <img src={src} alt={`Preview ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover",
                  borderRadius: 12, border: "2px solid rgba(244,167,185,0.4)" }} />
              <button
                onClick={() => remove(i)}
                style={{
                  position: "absolute", top: -6, right: -6,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#e07a8a", border: "2px solid #fff",
                  color: "#fff", fontSize: 11, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", lineHeight: 1,
                }}
              >×</button>
            </div>
          ))}
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              width: 80, height: 80, borderRadius: 12,
              border: "2px dashed rgba(196,164,132,0.35)",
              background: "#fdf4e7", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#c4a484", fontSize: 24, fontWeight: 300,
            }}
          >+</button>
        </div>
      )}
    </div>
  );
}

// ─── AddProduct page ──────────────────────────────────────────────────────────

interface FormErrors {
  images?: string;
  name?: string;
  category?: string;
  price?: string;
  description?: string;
}

export default function AddProduct() {
  const [, setLocation] = useLocation();

  // Fields
  const name        = useField();
  const price       = useField();
  const length      = useField();
  const width       = useField();
  const height      = useField();
  const description = useField();
  const [category, setCategory]   = useState("");
  const [catFocused, setCatFocused] = useState(false);
  const [images, setImages]       = useState<string[]>([]);
  const [errors, setErrors]       = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (images.length === 0) e.images = "Add at least one product image";
    if (!name.value.trim())  e.name = "Product name is required";
    if (!category)           e.category = "Select a category";
    if (!price.value.trim()) e.price = "Price is required";
    else if (isNaN(Number(price.value)) || Number(price.value) <= 0) e.price = "Enter a valid price";
    if (!description.value.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));

    // Persist new product to localStorage so SellerProfile can display it
    const newProduct = {
      id: `seller-${Date.now()}`,
      name: name.value.trim(),
      category,
      price: parseFloat(price.value),
      description: description.value.trim(),
      image: images[0] ?? "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
      gallery: images.length > 0 ? images : ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"],
      seller: "My Shop",
      sellerRating: 5.0,
      sellerSales: 0,
      rating: 0,
      reviewCount: 0,
      artType: "Crochet" as const,
      size: "Medium" as const,
      availableSizes: [],
      availableColors: [],
      inStock: true,
      isNew: true,
      isBestSeller: false,
      materials: "",
      careInstructions: "",
      deliveryInfo: "Ships in 3–5 days",
      reviews: [],
    };

    try {
      const existing = JSON.parse(localStorage.getItem("seller_products_v1") ?? "[]");
      localStorage.setItem("seller_products_v1", JSON.stringify([newProduct, ...existing]));
    } catch {}

    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setLocation("/seller/profile"), 1600);
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf8f2", display: "flex",
        alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 24,
            color: "#3d2b1f", margin: "0 0 8px" }}>Product added!</h2>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#8a6a55" }}>
            Redirecting to your profile…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f2" }}>
      <Navbar />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 24px 80px" }}>
        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => setLocation("/seller/profile")}
            style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#c4a484",
              background: "none", border: "none", cursor: "pointer", padding: 0,
              marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}
          >
            ← Back to profile
          </button>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 28,
            color: "#3d2b1f", margin: "0 0 6px" }}>Add a Product</h1>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#8a6a55", margin: 0 }}>
            List your handmade creation and reach buyers who love unique pieces.
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: "#fff", borderRadius: 24, padding: "32px",
            boxShadow: "0 8px 32px rgba(196,164,132,0.12), 0 2px 8px rgba(196,164,132,0.06)",
            border: "1px solid rgba(196,164,132,0.1)",
            display: "flex", flexDirection: "column", gap: 28,
          }}>

            {/* ── Row 1: Images ── */}
            <div>
              <Label required>Product Images & Video</Label>
              <ImageUpload images={images} onChange={setImages} />
              <ErrorMsg msg={errors.images} />
            </div>

            <div style={{ height: 1, background: "rgba(196,164,132,0.1)" }} />

            {/* ── Row 2: Name + Category ── */}
            <div className="form-row-2" style={{ display: "grid",
              gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <Label required>Product Name</Label>
                <input
                  value={name.value}
                  onChange={(e) => { name.setValue(e.target.value); if (errors.name) setErrors((er) => ({ ...er, name: undefined })); }}
                  onFocus={() => name.setFocused(true)}
                  onBlur={() => name.setFocused(false)}
                  placeholder="e.g. Chunky Knit Sweater"
                  style={inputStyle(name.focused, !!errors.name)}
                />
                <ErrorMsg msg={errors.name} />
              </div>
              <div>
                <Label required>Category</Label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); if (errors.category) setErrors((er) => ({ ...er, category: undefined })); }}
                  onFocus={() => setCatFocused(true)}
                  onBlur={() => setCatFocused(false)}
                  style={{ ...inputStyle(catFocused, !!errors.category), appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c4a484' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
                    paddingRight: 40, cursor: "pointer" }}
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ErrorMsg msg={errors.category} />
              </div>
            </div>

            {/* ── Row 3: Price + Dimensions ── */}
            <div className="form-row-2" style={{ display: "grid",
              gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <Label required>Price (USD)</Label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%",
                    transform: "translateY(-50%)", fontFamily: "'Poppins',sans-serif",
                    fontWeight: 700, fontSize: 14, color: "#c4a484" }}>$</span>
                  <input
                    type="number" min="0" step="0.01"
                    value={price.value}
                    onChange={(e) => { price.setValue(e.target.value); if (errors.price) setErrors((er) => ({ ...er, price: undefined })); }}
                    onFocus={() => price.setFocused(true)}
                    onBlur={() => price.setFocused(false)}
                    placeholder="0.00"
                    style={{ ...inputStyle(price.focused, !!errors.price), paddingLeft: 28 }}
                  />
                </div>
                <ErrorMsg msg={errors.price} />
              </div>
              <div>
                <Label>Dimensions (cm)</Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { field: length, placeholder: "L" },
                    { field: width,  placeholder: "W" },
                    { field: height, placeholder: "H" },
                  ].map(({ field, placeholder }) => (
                    <input
                      key={placeholder}
                      type="number" min="0"
                      value={field.value}
                      onChange={(e) => field.setValue(e.target.value)}
                      onFocus={() => field.setFocused(true)}
                      onBlur={() => field.setFocused(false)}
                      placeholder={placeholder}
                      style={inputStyle(field.focused)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Row 4: Description ── */}
            <div>
              <Label required>Product Description</Label>
              <textarea
                value={description.value}
                onChange={(e) => { description.setValue(e.target.value); if (errors.description) setErrors((er) => ({ ...er, description: undefined })); }}
                onFocus={() => description.setFocused(true)}
                onBlur={() => description.setFocused(false)}
                placeholder="Tell buyers about your product — materials, process, what makes it special…"
                rows={5}
                style={{
                  ...inputStyle(description.focused, !!errors.description),
                  resize: "vertical", minHeight: 120, lineHeight: 1.7,
                }}
              />
              <ErrorMsg msg={errors.description} />
            </div>

            {/* ── Submit ── */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15,
                  color: "#fff",
                  background: submitting
                    ? "rgba(196,164,132,0.4)"
                    : "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
                  border: "none", borderRadius: 50,
                  padding: "15px 52px", cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: submitting ? "none" : "0 6px 20px rgba(244,167,185,0.35)",
                  transition: "all 240ms cubic-bezier(0.34,1.56,0.64,1)",
                  minWidth: 200,
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.transform = "scale(1.04)";
                    e.currentTarget.style.boxShadow = "0 10px 28px rgba(244,167,185,0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = submitting ? "none" : "0 6px 20px rgba(244,167,185,0.35)";
                }}
              >
                {submitting ? "Adding product…" : "Add Product ✦"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 600px) {
          .form-row-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Footer />
    </div>
  );
}
