import Image from "next/image";

export function LogoMark({
  className = "",
  alt = "SDC emblem",
  priority = false,
}: {
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/sdc-logo.svg"
      alt={alt}
      width={1402}
      height={1404}
      unoptimized
      priority={priority}
      className={className}
    />
  );
}
