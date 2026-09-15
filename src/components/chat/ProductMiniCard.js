import Image from "next/image";
import StarRating from "@/components/StarRating";
import { formatPrice } from "@/lib/format";

export default function ProductMiniCard({ product }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-800">
          {product.name}
        </p>
        <StarRating rating={product.rating} className="mt-0.5" />
        <p className="mt-0.5 text-sm font-bold text-slate-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
}
