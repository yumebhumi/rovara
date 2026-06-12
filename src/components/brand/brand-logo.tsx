import Image from "next/image";
import { cn } from "@/utils/cn";

type BrandLogoProps = {
  variant?: "full" | "mark";
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function BrandLogo({
  variant = "full",
  className,
  priority = false,
  sizes
}: BrandLogoProps) {
  const asset = {
    src: "/rovara-logo-transparent.png",
    width: 1254,
    height: 1254
  };

  if (variant === "mark") {
    return (
      <span className={cn("relative inline-flex aspect-square overflow-hidden", className)}>
        <Image
          src={asset.src}
          alt="Rovara"
          fill
          priority={priority}
          sizes={sizes}
          className="select-none object-cover object-top scale-[1.52] -translate-y-[18%]"
        />
      </span>
    );
  }

  return (
    <Image
      src={asset.src}
      alt="Rovara"
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={cn("h-auto select-none", className)}
    />
  );
}
