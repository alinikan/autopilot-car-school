import brandAssets from '../../content/reference/emblems.json';

export function Badge({ name, size = 68 }: { name: string; size?: number }) {
  const src = (brandAssets as Record<string, string>)[name];
  return src ? (
    <img className="brand-emblem" src={src} width={size} height={size} alt={`${name} emblem`} />
  ) : (
    <span
      className="brand-wordmark"
      role="img"
      aria-label={`${name} brand name`}
      style={{ width: size, height: size }}
    >
      {name}
    </span>
  );
}
