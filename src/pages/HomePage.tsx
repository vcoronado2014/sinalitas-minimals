import { Helmet } from 'react-helmet-async';
// components
import ScrollProgress from '../components/scroll-progress';
// sections
import {
  HomeHero,
  HomeMinimal,
  HomeDarkMode,
  HomeLookingFor,
  HomeForDesigner,
  HomeColorPresets,
  HomePricingPlans,
  HomeAdvertisement,
  HomeCleanInterfaces,
  HomeHugePackElements,
} from '../sections/home';

/* import { useEffect } from 'react'; */

// ----------------------------------------------------------------------

export default function HomePage() {

  return (
    <>
      <Helmet>
        <title> Sin alitas app | Home</title>
      </Helmet>

      {/* <ScrollProgress /> */}

      <HomeHero />

{/*       <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      > */}
        {/* <HomeMinimal /> */}

        {/* <HomeHugePackElements /> */}

        {/* <HomeForDesigner /> */}

        {/* <HomeDarkMode /> */}

        {/* <HomeColorPresets /> */}

        {/* <HomeCleanInterfaces /> */}

        {/* <HomePricingPlans /> */}

        {/* <HomeLookingFor /> */}

        {/* <HomeAdvertisement /> */}

{/*         <Footer /> */}
      {/* </Box> */}
    </>
  );
}
