// @mui
import { styled } from '@mui/material/styles';
import { Box, Chip, Grid, Typography } from '@mui/material';
// @types
// import { IUserProfileCover } from '../../../../@types/user';
import { EmailInboxIcon } from 'src/assets/icons';
import Iconify from 'src/components/iconify';
import { IClientAccountGeneral } from '../../../../@types/client';
// utils
import { bgBlur } from '../../../../utils/cssStyles';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// components
import Image from '../../../../components/image';
import { CustomAvatar } from '../../../../components/custom-avatar';



// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  '&:before': {
    ...bgBlur({
      color: theme.palette.primary.darker,
    }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const StyledInfo = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

// `https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_${index + 1}.jpg`

export default function ProfileCoverMinClient({ client, comuna }: { client: any, comuna: any }) {


  return (
    <StyledRoot>
      <StyledInfo>
        <CustomAvatar
          /* src={client.avatarUrl} /assets/images/hombre-y-mujer.png */
          alt={client?.Nombres}
          name={client?.Nombres}
          src="/assets/images/hombre-y-mujer.png"
          sx={{
            mx: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.white',
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
            fontSize: 'xxx-large'
          }}
        />

        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
            
          <Typography variant="h4">{client?.Nombres} {client?.PrimerApellido}</Typography>
          <Typography sx={{ opacity: 0.72 }}>{comuna?.Nombre}</Typography>


        </Box>
      </StyledInfo>

      <Image
        alt="cover"
        src={`https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_${(Math.floor(Math.random() * 24) + 1)}.jpg`}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
        }}
      />
    </StyledRoot>
  );
}