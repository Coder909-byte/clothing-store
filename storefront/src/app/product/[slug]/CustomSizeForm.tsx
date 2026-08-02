"use client";

import { useState } from "react";

export interface SizeFormData {
  heightCm: number;
  bustCm?: number;
  waistCm?: number;
  hipCm?: number;
  notes?: string;
}

interface CustomSizeFormProps {
  onChange?: (data: SizeFormData) => void;
  productId?: string;
  productTitle?: string;
}

export default function CustomSizeForm({ onChange, productId, productTitle }: CustomSizeFormProps) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [height, setHeight] = useState("");
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const toCm = (val: string) => {
    const n = parseFloat(val);
    if (isNaN(n)) return NaN;
    return unit === "in" ? n * 2.54 : n;
  };

  const handleBlurValidate = () => {
    const cm = toCm(height);
    if (height && (cm < 120 || cm > 210)) {
      setError("Please enter a height between 120–210cm (or equivalent in inches).");
    } else {
      setError("");
      onChange?.({
        heightCm: cm,
        bustCm: bust ? toCm(bust) : undefined,
        waistCm: waist ? toCm(waist) : undefined,
        hipCm: hip ? toCm(hip) : undefined,
        notes: notes || undefined,
      });
    }
  };

  return (
    <div className="border border-neutral-300 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Customize Your Fit</h3>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setUnit("cm")}
            className={unit === "cm" ? "font-semibold underline" : "text-neutral-500"}
          >
            cm
          </button>
          <button
            type="button"
            onClick={() => setUnit("in")}
            className={unit === "in" ? "font-semibold underline" : "text-neutral-500"}
          >
            in
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Height ({unit}) *</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          onBlur={handleBlurValidate}
          className="w-full border border-neutral-300 rounded px-3 py-2"
          required
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm mb-1">Bust ({unit})</label>
          <input
            type="number"
            value={bust}
            onChange={(e) => setBust(e.target.value)}
            onBlur={handleBlurValidate}
            className="w-full border border-neutral-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Waist ({unit})</label>
          <input
            type="number"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            onBlur={handleBlurValidate}
            className="w-full border border-neutral-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Hip ({unit})</label>
          <input
            type="number"
            value={hip}
            onChange={(e) => setHip(e.target.value)}
            onBlur={handleBlurValidate}
            className="w-full border border-neutral-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleBlurValidate}
          className="w-full border border-neutral-300 rounded px-3 py-2"
          rows={2}
        />
      </div>
    </div>
  );
}