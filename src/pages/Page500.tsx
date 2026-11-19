import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Typography } from '@mui/material';
// locales
import { useLocales } from 'src/locales';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { SeverErrorIllustration } from '../assets/illustrations';

// ----------------------------------------------------------------------

export default function Page500() {
  const { translate } = useLocales();
  return (
    <>
      <Helmet>
        <title>{translate('errors.500.title').toString()}</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            {translate('errors.500.title').toString()}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            {translate('errors.404.subtitle').toString()}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} to="/" size="large" variant="contained">
          {translate('errors.btnHome').toString()}
        </Button>
      </MotionContainer>
    </>
  );
}
