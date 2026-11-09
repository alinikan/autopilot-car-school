export function CarShape({
  type = 'sedan',
  colour = '#172824',
  className = '',
}: {
  type?: string;
  colour?: string;
  className?: string;
}) {
  const path =
    type === 'pickup'
      ? 'M22 67V49L54 43L70 22H116L137 46H216V68Z'
      : type === 'suv'
        ? 'M18 68V44L41 38L60 17H164L193 39L218 48V68Z'
        : type === 'hatchback'
          ? 'M18 68V48L48 41L77 20H155L190 45L218 52V68Z'
          : 'M18 68V49L52 43L80 22H142L175 43L212 48L220 68Z';
  return (
    <svg className={className} viewBox="0 0 240 100" role="img" aria-label={`${type} silhouette`}>
      <path d={path} fill={colour} />
      <path
        d={
          type === 'pickup'
            ? 'M76 28H111L126 44H65Z'
            : type === 'suv'
              ? 'M68 24H156L177 43H51Z'
              : 'M84 29H139L159 43H66Z'
        }
        fill="#e5e8df"
        opacity=".8"
      />
      <circle cx="61" cy="69" r="19" fill="#1e2926" />
      <circle cx="61" cy="69" r="9" fill="#a6afa6" />
      <circle cx="182" cy="69" r="19" fill="#1e2926" />
      <circle cx="182" cy="69" r="9" fill="#a6afa6" />
    </svg>
  );
}
