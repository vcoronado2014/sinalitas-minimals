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

export default function ProfileCoverClient({ client }: { client: any }) {
  const rolId = sessionStorage.getItem('ROL_ID');
  const handleEmailClick = (mail: string) => {
    window.location.href = `mailto:${mail}`;
  };

  return (
    <StyledRoot>
      <StyledInfo>
        <CustomAvatar
          /* src={client.avatarUrl} */
          src="/assets/images/hombre-y-mujer.png"
          alt={client.name}
          name={client.name}
          sx={{
            mx: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.white',
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
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
            
          <Typography variant="h4">{client.name}</Typography>
          <Typography sx={{ opacity: 0.72 }}>{client.address} {client.observaciones ? ` ,obs dirección: ${client.observaciones}` : ''}</Typography>

          <Typography sx={{ opacity: 0.72 }}>{client.city}</Typography>
                {
                  rolId === '2' && 
                  <>
                  <Chip
                    
                    onClick={() => handleEmailClick(client.email)}
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 1, color: 'common.white' }}
                    icon={<Iconify icon="ic:baseline-alternate-email" />}
                    label={client.email}
                />
                &nbsp;&nbsp;
                </>
                }
                
                    <Chip
                        onClick={() => { }}
                        variant="outlined"
                        color="primary"
                        sx={{ mt: 1, color: 'common.white' }}
                        icon={<Iconify icon="pepicons-pop:cellphone-loop-circle" />}
                        label={client.phoneNumber}
                    />


        </Box>
      </StyledInfo>

      <Image
        alt="cover"
        src={client.cover}
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