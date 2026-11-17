"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useToast } from "@/components/ui/Toast";

const chips = ["Mahkota", "Sepal bertaji", "Benang sari"] as const;

/** Bagian interaktif contoh komponen (butuh state dan handler, jadi komponen klien). */
export function InteractiveDemo() {
  const toast = useToast();
  const [selected, setSelected] = useState<string>(chips[0]);
  const [variety, setVariety] = useState("fabiola");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Contoh chip pilihan">
        {chips.map((c) => (
          <Chip key={c} selected={selected === c} onClick={() => setSelected(c)}>
            {c}
          </Chip>
        ))}
      </div>
      <SegmentedControl
        legend="Varietas"
        name="demo-variety"
        value={variety}
        onChange={setVariety}
        options={[
          { value: "fabiola", label: "Fabiola" },
          { value: "claire", label: "Claire" },
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast.show("Contoh pemberitahuan informasi.", "info")}>Tampilkan info</Button>
        <Button variant="secondary" onClick={() => toast.show("Contoh tindakan berhasil.", "success")}>
          Tampilkan sukses
        </Button>
        <Button variant="outline" onClick={() => toast.show("Contoh kegagalan: periksa isian lalu coba lagi.", "error")}>
          Tampilkan galat
        </Button>
      </div>
    </div>
  );
}
