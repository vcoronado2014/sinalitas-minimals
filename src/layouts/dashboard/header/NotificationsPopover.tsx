import { noCase } from 'change-case';
import { useCallback, useEffect, useState } from 'react';
import axios from 'src/utils/axios';
import { IContador, IGraficoPack } from 'src/@types/indicadores';
// @mui
import {
  Box,
  Stack,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
  ListItem,
} from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// utils
import { fDate, fToNow } from '../../../utils/formatTime';
// _mock_
import { _notifications } from '../../../_mock/arrays';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------
interface IAlerta {
  Id: number;
  PcoId: number;
  CodigoCliente: string;
  NombreCliente: string;
  EmailCliente: string;
  TelefonosCliente: string;
  CantidadClases: number;
  ClasesAgendadas: number;
  CantidadAlumnos: number;
  FichasCreadas: number;
  TieneAceptaCondiciones: number;
  FechaCreacion: string;
  EsLeido: boolean;
  NombreProfesor: string;
  Avatar: string;
  Title: string;
  Description: string;
  Type: string;
  EsLeidoBol: boolean;
}

export default function NotificationsPopover() {
  const { user } = useAuthContext();

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const [notifications, setNotifications] = useState(_notifications);

  const [alertas, setAlertas] =useState<IAlerta[]>([]);

  const [countNoLeidas, setCountNoLeidas] = useState(0);

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const modificaAlertas = async (ids: string, tipoMovimiento: number, valor: number)=>{

    try{
      const data = {
        Ids: ids,
        TipoMovimiento: tipoMovimiento,
        Valor: valor
      }
      const response = await axios.put('/alertas', data);
      if (response){
        getAlertas();
      }
    }
    catch(error){
      console.log(error);
    }

  }

  const handleMarkAllAsRead = () => {

    const alertasMarcadas = alertas.map((alerta:IAlerta)=>({
      ...alerta,
      EsLeido: true
    }));
    const idsArray: number[] = [];
    const arrAlertas = alertasMarcadas.forEach(item=>{idsArray.push(item.Id)});

    const idsString: string = idsArray.join(',');
    
    modificaAlertas(idsString, 1, 1);
/*     setAlertas(alertasMarcadas);
    setCountNoLeidas(0); */
  };

  const getAlertas = useCallback(async () => {
    try {
      const profId = user?.RolId === 1 || user?.RolId === 2 ? '0' : user?.id.toString();
      const rolId = user?.RolId === 3 ? '0' : user?.RolId.toString(); 

      const response = await axios.post('/alertas', { ProfId: profId, RolId: rolId });


      if (user?.RolId === 2) {
        response.data.forEach((alerta: IAlerta) => {
          // alerta.
          alerta.Title = alerta.NombreCliente;
          alerta.EsLeido = alerta.EsLeidoBol;
          if (alerta.TieneAceptaCondiciones === 0) {
            alerta.Type = 'order_placed'
            alerta.Description = ` falta aceptar las condiciones del servicio, en el pack ${alerta.CodigoCliente}`;
          }
          else {
            if (alerta.FichasCreadas < alerta.CantidadAlumnos) {
              alerta.Type = 'friend_interactive';
              alerta.Avatar = `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_2.jpg`;
              alerta.Description = ` falta crear la ficha de ${alerta.CantidadAlumnos - alerta.FichasCreadas} alumno, en el pack ${alerta.CodigoCliente}`
            }
            if (alerta.ClasesAgendadas < alerta.CantidadClases) {
              alerta.Type = 'order_placed'
              alerta.Description = ` falta agendar ${alerta.CantidadClases - alerta.ClasesAgendadas} clase, en el pack ${alerta.CodigoCliente}`
            }
          }
        });
      }
      else{
        // profesor
        response.data.forEach((alerta: IAlerta) => {
          alerta.Title = alerta.NombreCliente;
          alerta.EsLeido = alerta.EsLeidoBol;
          // SIGNIFICA QUE SON CLASES DEL DÍA DE HOY
          if (alerta.TieneAceptaCondiciones === 0) {
            alerta.Type = 'friend_interactive';
            alerta.Avatar = user?.photoURL;
            alerta.Description = ` tienes clase hoy a las ${fDate(alerta.FechaCreacion, 'HH:mm')}`;

          }
          else if (alerta.ClasesAgendadas < alerta.CantidadClases) {
            alerta.Type = 'order_placed'
            alerta.Description = ` falta agendar ${alerta.CantidadClases - alerta.ClasesAgendadas} clase`
          }
          
        });
      }


      setAlertas(response.data);
      const noLeidas = response.data.filter((item:any) => item.EsLeido === false).length;
      setCountNoLeidas(noLeidas);

    } catch (error) {
      // setLoading(false);
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    getAlertas();
    const intervalId = setInterval(getAlertas, 60000);

    return () => clearInterval(intervalId);

  }, [getAlertas]);

  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={countNoLeidas} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notificaciones</Typography>

            {
              alertas.length === 0 && (<Typography variant="body2" sx={{ color: 'text.secondary' }}>No hay</Typography>)
            }
            {
              alertas.length > 0 && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {
                    countNoLeidas > 0 ? `Tienes ${countNoLeidas} notificaciones no leídas` : `Todas leídas`
                  }
                </Typography>
              )
            }

          </Box>

          {(countNoLeidas > 0 && alertas.length > 0)  && (
            <Tooltip title=" Marcar como leídas">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {
          alertas.length > 0 && (
            <Scrollbar sx={{ height: { xs: 340, sm: 600 } }}>
              <List
                disablePadding
                subheader={
                  <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                    Nuevas
                  </ListSubheader>
                }
              >
                {alertas.map((alerta) => (
                  <AlertaItem key={alerta.Id} alerta={alerta} modificaAlertas={modificaAlertas} />
                ))}
              </List>

              {/*           <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Anteriores
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List> */}
            </Scrollbar>
          )
        }


        <Divider sx={{ borderStyle: 'dashed' }} />

{/*         <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box> */}
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

type NotificationItemProps = {
  id: string;
  title: string;
  description: string;
  avatar: string | null;
  type: string;
  createdAt: Date;
  isUnRead: boolean;
};

function NotificationItem({ notification }: { notification: NotificationItemProps }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">{fToNow(notification.createdAt)}</Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/notification/ic_package.svg" />,
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/notification/ic_shipping.svg" />,
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/notification/ic_mail.svg" />,
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/notification/ic_chat.svg" />,
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}

// ----------------------------------------------------------------------

interface AlertaItemProps {
  alerta: IAlerta;
  modificaAlertas: (ids: string, tipoMovimiento: number, valor: number) => Promise<void>;
}

function AlertaItem({ alerta, modificaAlertas }: AlertaItemProps) {
  // const {  } = renderContentAlerta(alerta);
  const {avatar, title} = renderContentAlerta(alerta);

  return (
    <ListItem
      sx={{
        /* py: 1.5, */
        pl: 2,
        px: 2.5,
        mt: '1px',
        ...(!alerta.EsLeido && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <>
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">{fToNow(alerta.FechaCreacion)}</Typography>
          </Stack>
            <Stack direction="row" sx={{ justifyContent: 'flex-end', width: '100%' }}>
              <IconButton
                size="small"
                color="inherit"
                onClick={()=>modificaAlertas(alerta.Id.toString(), 2, 1)}
                sx={{ color: 'text.secondary', mr: 0.5 }}
              >
                <Iconify icon="eva:trash-2-fill" width={16} />
              </IconButton>
              {
                alerta.EsLeidoBol
                  ? (
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={()=>modificaAlertas(alerta.Id.toString(), 1, 0)}
                      sx={{ color: 'text.secondary', mr: 1 }}
                    >
                      <Iconify icon="eva:done-all-fill" width={16} />
                    </IconButton>

                  )
                  : (
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={()=>modificaAlertas(alerta.Id.toString(), 1, 1)}
                      sx={{ color: 'text.secondary', mr: 1 }}
                    >
                      <Iconify icon="eva:checkmark-fill" width={16} />
                    </IconButton>
                  )
              }
            </Stack>
            </>
        }
      />
    </ListItem>
  );
}

// ----------------------------------------------------------------------

function renderContentAlerta(alerta: IAlerta) {
  const title = (
    <Typography variant="subtitle2">
      {alerta.Title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {alerta.Description}
      </Typography>
    </Typography>
  );

  if (alerta.Type === 'order_placed') {
    return {
      avatar: <img alt={alerta.Type} src="/assets/icons/notification/ic_package.svg" />,
      title,
    };
  }
  if (alerta.Type === 'order_shipped') {
    return {
      avatar: <img alt={alerta.Title} src="/assets/icons/notification/ic_shipping.svg" />,
      title,
    };
  }
  if (alerta.Type === 'mail') {
    return {
      avatar: <img alt={alerta.Title} src="/assets/icons/notification/ic_mail.svg" />,
      title,
    };
  }
  if (alerta.Type === 'chat_message') {
    return {
      avatar: <img alt={alerta.Title} src="/assets/icons/notification/ic_chat.svg" />,
      title,
    };
  }
  return {
    avatar: alerta.Avatar ? <img alt={alerta.Title} src={alerta.Avatar} /> : null,
    title,
  };
}
