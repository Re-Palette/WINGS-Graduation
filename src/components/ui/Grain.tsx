/** Film grain + vignette. Purely atmospheric, never interactive. */
export default function Grain({ vignette = true }: { vignette?: boolean }) {
  return (
    <>
      <div className="grain z-30" aria-hidden="true" />
      {vignette && <div className="vignette z-30" aria-hidden="true" />}
    </>
  );
}
