/**
 * The numeral + label + hairline that anchors the left edge of every
 * chapter, lifted from the comp. Fixed to the section, never to the page.
 */
export default function SectionIndex({
  index,
  label,
  tone = 'light',
  className = '',
}: {
  index: string;
  label: string;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const color = tone === 'light' ? 'text-paper' : 'text-navy';

  return (
    <div
      className={`pointer-events-none select-none ${color} ${className}`}
      aria-hidden="true"
    >
      <p className="section-index leading-none opacity-70">{index}</p>
      <p className="en-label mt-3 text-[0.55rem] opacity-55 sm:text-[0.6rem]">
        {label}
      </p>
      <div
        className={`index-rule mt-5 h-12 sm:h-16 ${
          tone === 'dark' ? 'opacity-30' : 'opacity-60'
        }`}
      />
    </div>
  );
}
