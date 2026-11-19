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
import { ForbiddenIllustration } from '../assets/illustrations';

// ----------------------------------------------------------------------

export default function Page403() {
  const { translate } = useLocales();

  return (
    <>
      <Helmet>
        <title>{translate('errors.403.page').toString()}</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            {translate('errors.403.title').toString()}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            {translate('errors.403.subtitle1').toString()}
            <br />
            {translate('errors.403.subtitle2').toString()}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} to="/" size="large" variant="contained">
          {translate('errors.btnHome').toString()}
        </Button>
      </MotionContainer>
    </>
  );
}
