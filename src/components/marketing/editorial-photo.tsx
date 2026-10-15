import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Photo } from "@/lib/photos";

export function EditorialPhoto({
  photo,
  priority = false,
  className,
  imgClassName,
  showCaption = true,
  overlay = false,
}: {
  photo: Photo;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  showCaption?: boolean;
  overlay?: boolean;
}) {
  return (
    <figure className={cn("group", className)}>
      <div className="relative overflow-hidden bg-bg-2">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={2000}
          height={1333}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1100px"
          className={cn(
            "photo-treat h-full w-full object-cover transition duration-700 ease-out group-hover:opacity-90",
            imgClassName,
          )}
        />
        {overlay ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1410]/70 via-[#1a1410]/15 to-transparent"
          />
        ) : null}
      </div>
      {showCaption ? (
        <figcaption className="mt-3 flex items-baseline justify-between gap-6 border-t border-line pt-2 text-[11px] tracking-wide text-muted">
          <span>{photo.caption}</span>
          <span className="shrink-0 uppercase tracking-[0.16em]">{photo.credit}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
