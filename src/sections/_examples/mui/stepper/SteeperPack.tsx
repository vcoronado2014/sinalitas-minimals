import { useState } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Step,
  Paper,
  Button,
  Stepper,
  StepLabel,
  Typography,
  StepConnector,
  stepConnectorClasses,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';

import { postAceptaCondiciones } from 'src/redux/slices/aceptaCondiciones';
import { useDispatch, useSelector } from 'src/redux/store';

import { StepIconProps } from '@mui/material/StepIcon';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
// utils
import { bgGradient } from '../../../../utils/cssStyles';
// components
import Iconify from '../../../../components/iconify';
import TextMaxLine from '../../../../components/text-max-line';


// ----------------------------------------------------------------------

const STEPS = ['Acepta condiciones', 'Terminado'];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderRadius: 1,
    borderTopWidth: 3,
    borderColor: theme.palette.divider,
  },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    height: 22,
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.disabled,
    ...(ownerState.active && {
      color: theme.palette.success.main,
    }),
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Iconify
          icon="eva:checkmark-fill"
          className="QontoStepIcon-completedIcon"
          width={24}
          height={24}
        />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      ...bgGradient({
        startColor: theme.palette.error.light,
        endColor: theme.palette.error.main,
      }),
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      ...bgGradient({
        startColor: theme.palette.error.light,
        endColor: theme.palette.error.main,
      }),
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundColor: theme.palette.divider,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  zIndex: 1,
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.disabled,
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
  ...(ownerState.active && {
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    color: theme.palette.common.white,
    ...bgGradient({
      startColor: theme.palette.error.light,
      endColor: theme.palette.error.main,
    }),
  }),
  ...(ownerState.completed && {
    color: theme.palette.common.white,
    ...bgGradient({
      startColor: theme.palette.error.light,
      endColor: theme.palette.error.main,
    }),
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <Iconify icon="eva:settings-2-outline" width={24} />,
    2: <Iconify icon="eva:monitor-outline" width={24} />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

/* function getStepContent(step: number) {
  switch (step) {
    case 0:
      return '¿Estás de acuerdo con los términos y condiciones?';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
} */


function getStepContent(step: number, handleClickOpen: VoidFunction) {
  switch (step) {
    case 0:
      return (
        <><Typography variant='subtitle1' sx={{ my: 1 }}>
          ¿Estás de acuerdo con los términos y condiciones?
        </Typography>
          <TextMaxLine line={4} asLink onClick={handleClickOpen}>
            <h4> RESPONSABILIDAD SINALITAS</h4>
            <div>

              1. Garantizamos que todos sus profesores están capacitados para realizar clases de natación y trabajar con menores
              de edad, siendo previamente capacitados y revisada su información tanto profesional como personal.
              <br />
              2. Entregamos información profesional de nuestros profesores solo a nuestros clientes inscritos.
              <br />
              3. Nos hacemos responsable de toda acción profesional de nuestro staff quedando fuera de toda responsabilidad legal
              ante cualquier comportamiento no profesional de nuestro profesionales. Toda actividad o acto no adecuado fuera de
              lugar de trabajo cae en responsabilidad de la persona que lo realice. La primera clase se realizará completamente
              GRATIS siempre y cuando nuestros clientes contraten cualquier pack de natación.
              <br />
              4. El profesor podra llegar con un máximo de 10 minutos de atraso, si este tiempo es superado la clienta tendra la
              facultad de reagendar esta clase en el mismo patron de horarios y días contratados.
              <br />
              5. Nuestros clientes tendran acceso a una aplicación donde podra de revisar sus clases agendadas, asi como tambien
              ingresar datos de alumnos, aceptar condiciones y revisar el perfil e información de su profesor. Esta información es
              completamente confidencia.
              <br />
              6. Sinalitas dentro de su normativa, exige que nuestoros profesionales comiencen y terminen sus pack de clases, de
              suceder lo contrario nuestros clientes tendran la libertad de poder elegir dar por finalizada las clases o reagendar
              con otro profesor. Si decide terminar su pack antes de la finalización pactada se respetara el valor de clase pack,
              si opta por continuar con otro profesor la empresa le regala una clase para la adaptación de los niños.
              <br />
              7. Es responsabilidad de SinAlitas que todo alumno deba realizar la evaluación diagnostica en la primera clase,
              además de ser compartida con el apoderado o responsable.
              <br />
              8. Todo niño que participe de los pack SinAlitas debe tener una ficha medica personalizada, la cual de ser ingresada
              en la aplicación al momento de ser asginado un codigo de clienta. La persona responsable en ingresar los datos debe
              ingresar la información solicitada y totalmente correcta en caso de cualquier tipo de accidente.
              <br />
              9. Nuestros profesores se pondran en contacto con nuestras clientas en caso de retraso o problemas para asistir a
              las clases.
              <br />
              <h5>RESPONSABILIDAD DEL CLIENTE</h5>
              1. Las clientas tendran un minimo 2 hrs antes de cada clase para reagendar o cancelar, de lo contrario la clase se
              considerara como realizada y el sistema no podra agendarla nuevamente. Esto debera ser avisado por whastapp para
              dejar respaldo de lo ocurrido.
              <br />
              2. Toda clienta SinAlitas podrá evaluar y comentar sobre nuestros profesores, la experiencia vivida junto a nosotros
              es muy importante para seguir mejorando. Esto lo podra hacer de manera libre, respetando la privacidad de sus
              comentarios.
              <br />
              3. Es indispensable para realizar cualquier clase, que la piscina en la cual se trabaje deba estar en optimas
              condiciones, por seguridad de los niños y de nuestros profesionales, de lo contrario la clase se deberá realizar
              fuera de la piscina o en extremo se cancelará, contando esta como realizada.
              <br />
              4. El profesor podrá esperar 15 minutos de atraso de nuestros clientes para comenzar la clase. Si la espera es
              superior, la clasese va a considerar como clase realizada y el profesor podra retirase del hogar.
              <br />
              5. Si nuestros clientes no realizan la trasnferencia por diferentes motivos en la fecha solicitada por nuestra
              coordinadora, se enviara un equipo de cobranza a su domicilio para solicitar el dinero en efectivo.
              <br />
              6. A la 6ta o 9na clase como máximo según corresponda, se deberá pagar la totalidad de pack, de lo contrario la
              clase siguiente no podrá ser realizada.
              <br />
              7. Queda completamente prohibido INCLUIR a niños que no esten inscritos al pack, de lo contrario el profesor tiene
              la facultad de cancelar su clase y administración le cobrara la clase adicional
              <br />
              8. Las clases realizadas en el horario AM tendran un descuento y las clases realizadas en los bloques punta de la
              tarde tendran un cargo adicional.
              <br />

              <h5>Recomendaciónes de SinAlitas</h5>
              Piscina que cumpla con los protocolo de seguridad y apta para trabajar con niños, evaluado por nuestro profesional
              Sinalitas
              Lugar cerrado donde el profesor pueda cambiarse de ropa
              Un adulto responsable en las clases
              Mantener alitas inflables en el domicilio

              <h5>APP SINALITAS</h5>
              1. Usted debera descargar nuestra aplicación de Google Play o App Store
              <br />
              2. Es su responsabilidad ingresar información veridica de los alumnos
              <br />
              3. Luego podra revisar sus clases agendadas, realizadas y pendientes
              <br />


              <h5>MODIFICACIONES DE CLASES</h5>
              1. Nuestros clientes podran reagendar un maximo de 3 clases por pack, esto lo mostrara el sistema, si el
              reagendamiento es por motivos del profesor, no se cuenta como 1 clase.
              <br />
              2. Se podra contratar un minimo de 5 clases por pack, costando estas el valor normal de una clase, NO valor clase de
              pack
              <br />
              3. Cada cliente deberá agendar entre 3 o 4 clases por semana, no recomendamos agendar 5.
              <br />
              4. Toda clase realizada los días SABADOS Y DOMINGOS O FESTIVOS tendrá un cargo adicional de $5.000 por clase, esta
              será sumada al total del pack contratado. Esto siempre y cuando el profesor tenga disponibilidad
              <br />
              <h5>PAGOS DE SERVICIOS</h5>
              1. Respecto al pago, solo aceptamos transferencia electrónica a cuenta corrienteo chequera electronica número
              371-7-353194-1,BANCO ESTADO, a Nombre Productora Deportiva Enggel Nicolas Nuñez Troncoso E.I.R.L rut 76.880.301-4.
              El comprobante depago debe ser enviado al correo pagos@sinalitas.cl. Ningún profesional de SinAlitas está autorizado
              para solicitar o recibir dinero en efectivo o cheques.
              <br />
              2. Solo se podran pagar las clases con WebPay que se realicen en Horarios PM, si existe una diferencia se debera
              trasnferir a nuestra cuenta.
              <br />
              Al acceder y utilizar este servicio, usted acepta y accede acumplir en los términos y requerimientos de este
              acuerdo.
            </div>
          </TextMaxLine>
        </>
      );
    case 1:
      return (
        <Typography variant='subtitle1' sx={{ my: 1 }}>
          Al presionar Aceptar estás de acuerdo con las condiciones del servicio y podrá agregar a los alumnos para quer le asignen al profesor.
        </Typography>
      )
    default:
      return (<></>)
  }
}

type SteeperPackProps = {
  onAcepta: VoidFunction;
  pcoId: string;
  codigoPack: string;
};

export default function SteeperPack({ onAcepta, pcoId, codigoPack }: SteeperPackProps) {
  const dispatch = useDispatch();

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === 1){
      // aca llamamos al endpoint de acepta condiciones
      dispatch(postAceptaCondiciones(pcoId));
      onAcepta();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // ****** dialog *******
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ************************

  return (
    <>
      <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 5 }} />


      {activeStep === STEPS.length ? (
        <>
          <Paper
            sx={{
              p: 3,
              my: 3,
              minHeight: 120,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
          >
            <Typography sx={{ my: 1 }}>All steps completed - you&apos;re finished</Typography>
          </Paper>

          <Button color="inherit" onClick={handleReset} sx={{ mr: 1 }}>
            Reset
          </Button>
        </>
      ) : (
        <>
          <Paper
            sx={{
              p: 3,
              my: 3,
              minHeight: 120,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
          >
            {getStepContent(activeStep, handleClickOpen)}
          </Paper>

          <Box sx={{ textAlign: 'right' }}>
            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Atrás
            </Button>
            <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
              {activeStep === STEPS.length - 1 ? 'Aceptar' : 'Estoy de acuerdo'}
            </Button>
          </Box>
        </>
      )}
      
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}

      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Acuerdo de condiciones
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Cerrar
            </Button>
          </Toolbar>
        </AppBar>
        <Typography variant='body1' sx={{p:2}}>
        <h4> RESPONSABILIDAD SINALITAS</h4>
            <div>

              1. Garantizamos que todos sus profesores están capacitados para realizar clases de natación y trabajar con menores
              de edad, siendo previamente capacitados y revisada su información tanto profesional como personal.
              <br />
              2. Entregamos información profesional de nuestros profesores solo a nuestros clientes inscritos.
              <br />
              3. Nos hacemos responsable de toda acción profesional de nuestro staff quedando fuera de toda responsabilidad legal
              ante cualquier comportamiento no profesional de nuestro profesionales. Toda actividad o acto no adecuado fuera de
              lugar de trabajo cae en responsabilidad de la persona que lo realice. La primera clase se realizará completamente
              GRATIS siempre y cuando nuestros clientes contraten cualquier pack de natación.
              <br />
              4. El profesor podra llegar con un máximo de 10 minutos de atraso, si este tiempo es superado la clienta tendra la
              facultad de reagendar esta clase en el mismo patron de horarios y días contratados.
              <br />
              5. Nuestros clientes tendran acceso a una aplicación donde podra de revisar sus clases agendadas, asi como tambien
              ingresar datos de alumnos, aceptar condiciones y revisar el perfil e información de su profesor. Esta información es
              completamente confidencia.
              <br />
              6. Sinalitas dentro de su normativa, exige que nuestoros profesionales comiencen y terminen sus pack de clases, de
              suceder lo contrario nuestros clientes tendran la libertad de poder elegir dar por finalizada las clases o reagendar
              con otro profesor. Si decide terminar su pack antes de la finalización pactada se respetara el valor de clase pack,
              si opta por continuar con otro profesor la empresa le regala una clase para la adaptación de los niños.
              <br />
              7. Es responsabilidad de SinAlitas que todo alumno deba realizar la evaluación diagnostica en la primera clase,
              además de ser compartida con el apoderado o responsable.
              <br />
              8. Todo niño que participe de los pack SinAlitas debe tener una ficha medica personalizada, la cual de ser ingresada
              en la aplicación al momento de ser asginado un codigo de clienta. La persona responsable en ingresar los datos debe
              ingresar la información solicitada y totalmente correcta en caso de cualquier tipo de accidente.
              <br />
              9. Nuestros profesores se pondran en contacto con nuestras clientas en caso de retraso o problemas para asistir a
              las clases.
              <br />
              <h5>RESPONSABILIDAD DEL CLIENTE</h5>
              1. Las clientas tendran un minimo 2 hrs antes de cada clase para reagendar o cancelar, de lo contrario la clase se
              considerara como realizada y el sistema no podra agendarla nuevamente. Esto debera ser avisado por whastapp para
              dejar respaldo de lo ocurrido.
              <br />
              2. Toda clienta SinAlitas podrá evaluar y comentar sobre nuestros profesores, la experiencia vivida junto a nosotros
              es muy importante para seguir mejorando. Esto lo podra hacer de manera libre, respetando la privacidad de sus
              comentarios.
              <br />
              3. Es indispensable para realizar cualquier clase, que la piscina en la cual se trabaje deba estar en optimas
              condiciones, por seguridad de los niños y de nuestros profesionales, de lo contrario la clase se deberá realizar
              fuera de la piscina o en extremo se cancelará, contando esta como realizada.
              <br />
              4. El profesor podrá esperar 15 minutos de atraso de nuestros clientes para comenzar la clase. Si la espera es
              superior, la clasese va a considerar como clase realizada y el profesor podra retirase del hogar.
              <br />
              5. Si nuestros clientes no realizan la trasnferencia por diferentes motivos en la fecha solicitada por nuestra
              coordinadora, se enviara un equipo de cobranza a su domicilio para solicitar el dinero en efectivo.
              <br />
              6. A la 6ta o 9na clase como máximo según corresponda, se deberá pagar la totalidad de pack, de lo contrario la
              clase siguiente no podrá ser realizada.
              <br />
              7. Queda completamente prohibido INCLUIR a niños que no esten inscritos al pack, de lo contrario el profesor tiene
              la facultad de cancelar su clase y administración le cobrara la clase adicional
              <br />
              8. Las clases realizadas en el horario AM tendran un descuento y las clases realizadas en los bloques punta de la
              tarde tendran un cargo adicional.
              <br />

              <h5>Recomendaciónes de SinAlitas</h5>
              Piscina que cumpla con los protocolo de seguridad y apta para trabajar con niños, evaluado por nuestro profesional
              Sinalitas
              Lugar cerrado donde el profesor pueda cambiarse de ropa
              Un adulto responsable en las clases
              Mantener alitas inflables en el domicilio

              <h5>APP SINALITAS</h5>
              1. Usted debera descargar nuestra aplicación de Google Play o App Store
              <br />
              2. Es su responsabilidad ingresar información veridica de los alumnos
              <br />
              3. Luego podra revisar sus clases agendadas, realizadas y pendientes
              <br />


              <h5>MODIFICACIONES DE CLASES</h5>
              1. Nuestros clientes podran reagendar un maximo de 3 clases por pack, esto lo mostrara el sistema, si el
              reagendamiento es por motivos del profesor, no se cuenta como 1 clase.
              <br />
              2. Se podra contratar un minimo de 5 clases por pack, costando estas el valor normal de una clase, NO valor clase de
              pack
              <br />
              3. Cada cliente deberá agendar entre 3 o 4 clases por semana, no recomendamos agendar 5.
              <br />
              4. Toda clase realizada los días SABADOS Y DOMINGOS O FESTIVOS tendrá un cargo adicional de $5.000 por clase, esta
              será sumada al total del pack contratado. Esto siempre y cuando el profesor tenga disponibilidad
              <br />
              <h5>PAGOS DE SERVICIOS</h5>
              1. Respecto al pago, solo aceptamos transferencia electrónica a cuenta corrienteo chequera electronica número
              371-7-353194-1,BANCO ESTADO, a Nombre Productora Deportiva Enggel Nicolas Nuñez Troncoso E.I.R.L rut 76.880.301-4.
              El comprobante depago debe ser enviado al correo pagos@sinalitas.cl. Ningún profesional de SinAlitas está autorizado
              para solicitar o recibir dinero en efectivo o cheques.
              <br />
              2. Solo se podran pagar las clases con WebPay que se realicen en Horarios PM, si existe una diferencia se debera
              trasnferir a nuestra cuenta.
              <br />
              Al acceder y utilizar este servicio, usted acepta y accede acumplir en los términos y requerimientos de este
              acuerdo.
            </div>
        </Typography>
      </Dialog>
    
    </>
  );
}