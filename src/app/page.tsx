import Nav from '@/components/Nav';
import Preloader from '@/components/Preloader';
import ProgressRail from '@/components/ProgressRail';
import Opening from '@/components/sections/Opening';
import OurStory from '@/components/sections/OurStory';
import ThreeYears from '@/components/sections/ThreeYears';
import Memories from '@/components/sections/Memories';
import Team from '@/components/sections/Team';
import FinalHuddle from '@/components/sections/FinalHuddle';
import ThankYou from '@/components/sections/ThankYou';
import Ending from '@/components/sections/Ending';

export default function Page() {
  return (
    <>
      <Preloader />
      <Nav />
      <ProgressRail />

      <main>
        {/* 01 */} <Opening />
        {/* 02 */} <OurStory />
        {/* 03 */} <ThreeYears />
        {/* 04 */} <Memories />
        {/* 05 */} <Team />
        {/* 06 */} <FinalHuddle />
        {/* 07 */} <ThankYou />
        {/* 08 */} <Ending />
      </main>
    </>
  );
}
