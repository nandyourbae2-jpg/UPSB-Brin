"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IconSearch } from "@/components/icons";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { BottomSheet } from "@/components/ui/DialogAndSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { catalogStrings, filterCatalogProducts, type CatalogProduct } from "@/content/catalog";

interface CatalogViewProps {
  products: readonly CatalogProduct[];
  showIndicativePrices: boolean;
}

export function CatalogView({ products, showIndicativePrices }: CatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedType = searchParams.get("jenis") ?? "all";
  const selectedVariety = searchParams.get("varietas") ?? "all";

  const filtered = filterCatalogProducts(products, {
    type: selectedType,
    variety: selectedVariety,
  });

  function updateFilter(nextType: string, nextVariety: string) {
    const params = new URLSearchParams();
    if (nextType !== "all") params.set("jenis", nextType);
    if (nextVariety !== "all") params.set("varietas", nextVariety);
    const qs = params.toString();
    router.replace(qs ? `/produk?${qs}` : "/produk", { scroll: false });
  }

  const hasActiveFilter = selectedType !== "all" || selectedVariety !== "all";

  const filterControls = (
    <div className="flex flex-col gap-4">
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 text-body-sm font-bold text-ink-muted">{catalogStrings.filter.typeLegend}</legend>
        <div className="flex flex-wrap gap-2">
          {catalogStrings.filter.types.map((opt) => (
            <Chip
              key={opt.value}
              selected={selectedType === opt.value}
              onClick={() => updateFilter(opt.value, selectedVariety)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 text-body-sm font-bold text-ink-muted">{catalogStrings.filter.varietyLegend}</legend>
        <div className="flex flex-wrap gap-2">
          {catalogStrings.filter.varieties.map((opt) => (
            <Chip
              key={opt.value}
              selected={selectedVariety === opt.value}
              onClick={() => updateFilter(selectedType, opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <Button variant="outline" onClick={() => setSheetOpen(true)}>
          {catalogStrings.filter.openMobile}
        </Button>
        {hasActiveFilter ? (
          <Button variant="secondary" size="sm" onClick={() => updateFilter("all", "all")}>
            {catalogStrings.filter.reset}
          </Button>
        ) : null}
      </div>

      <div className="hidden rounded-lg border border-line bg-surface p-4 md:block">
        <div className="flex flex-wrap items-end justify-between gap-4">
          {filterControls}
          {hasActiveFilter ? (
            <Button variant="outline" size="sm" onClick={() => updateFilter("all", "all")}>
              {catalogStrings.filter.reset}
            </Button>
          ) : null}
        </div>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={catalogStrings.filter.sheetTitle}>
        {filterControls}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={() => setSheetOpen(false)}>{catalogStrings.filter.apply}</Button>
          {hasActiveFilter ? (
            <Button
              variant="outline"
              onClick={() => {
                updateFilter("all", "all");
                setSheetOpen(false);
              }}
            >
              {catalogStrings.filter.reset}
            </Button>
          ) : null}
        </div>
      </BottomSheet>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} showIndicativePrices={showIndicativePrices} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IconSearch width={40} height={40} />}
          title={catalogStrings.empty.title}
          body={catalogStrings.empty.body}
          action={
            <Button variant="secondary" onClick={() => updateFilter("all", "all")}>
              {catalogStrings.filter.reset}
            </Button>
          }
        />
      )}
    </div>
  );
}
