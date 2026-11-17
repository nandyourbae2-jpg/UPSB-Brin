"use client";

import { Chip } from "@/components/ui/Chip";
import type { FlowerPartData } from "@/lib/flower-data";

interface PartChipsProps {
  parts: readonly FlowerPartData[];
  selectedPartId: string | null;
  label: string;
  onSelect: (partId: string) => void;
}

/**
 * Daftar chip bagian bunga sebagai alternatif keyboard penuh (XP-05, Rule 02).
 * Setiap tombol membuka lembar info yang sama dengan ketukan pada model 3D.
 */
export function PartChips({ parts, selectedPartId, label, onSelect }: PartChipsProps) {
  if (parts.length === 0) return null;
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {parts.map((part) => (
        <Chip key={part.id} selected={selectedPartId === part.id} onClick={() => onSelect(part.id)}>
          {part.title}
        </Chip>
      ))}
    </div>
  );
}
