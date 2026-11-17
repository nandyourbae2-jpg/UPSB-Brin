import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FlowerPoster } from "@/components/ui/FlowerPoster";
import { StatusPill } from "@/components/ui/StatusPill";
import { catalogStrings, type CatalogProduct } from "@/content/catalog";
import { id } from "@/content/id";

export function ProductCard({
  product,
  showIndicativePrices,
}: {
  product: CatalogProduct;
  showIndicativePrices: boolean;
}) {
  return (
    <Card elevation="raised" className="flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone={product.productType === "stek" ? "success" : "info"}>{product.productLabel}</StatusPill>
            <StatusPill tone="neutral">{product.availabilityLabel}</StatusPill>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          <div className="flex flex-col items-center gap-1 rounded-lg bg-surface-alt p-3">
            <FlowerPoster
              variant={product.variety}
              size="md"
              label={product.variety === "fabiola" ? id.a11y.fabiolaPosterLabel : id.a11y.clairePosterLabel}
            />
            <span className="text-caption text-ink-muted">Ilustrasi</span>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-title2 font-extrabold text-ink">{product.varietyName}</h2>
            <p className="text-body-sm text-ink-muted">{product.audience}</p>
            {showIndicativePrices ? (
              <p className="pt-1 text-title3 font-bold text-ink">
                {product.indicativePrice}{" "}
                <span className="text-body-sm font-medium text-ink-muted">{product.unit}</span>
              </p>
            ) : (
              <p className="pt-1 text-body-sm font-bold text-ink-muted">{catalogStrings.card.priceHidden}</p>
            )}
          </div>
        </div>

        <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-body-sm text-ink">
          {product.traits.map((trait) => (
            <li key={trait}>{trait}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <ButtonLink href={product.orderHref}>{catalogStrings.card.requestCta}</ButtonLink>
        <ButtonLink href={product.detailHref} variant="outline">
          {catalogStrings.card.detailCta}
        </ButtonLink>
      </div>
    </Card>
  );
}
