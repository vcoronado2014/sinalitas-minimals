/* eslint-disable import/no-duplicates */
import { format, formatDistanceToNow, isValid, getTime } from 'date-fns';
import esLocale from 'date-fns/locale/es';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null;
type DateStringNum = Date | string | number;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm,{
    locale: esLocale,
  }) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: esLocale,
    })
    : '';
}

export function fDDDMMM(date: DateStringNum) {
  return format(new Date(date), 'dd \'de\' MMMM', {
    locale: esLocale,
  });
}

export function fDateTimeSuffix(date: DateStringNum) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}


export function fDateWithoutUTC(date: DateStringNum) {
  // Retorna la fecha sin UTC, asi no devuelve un dia distinto dependiendo del GMT
  return `${new Date(date).toISOString().slice(0, 10)}T00:00:01`;
}

export function fDateToShow(date: DateStringNum | null) {
  // formatea la fecha para mostrarla en pantalla.
  // En caso de que sea null o fecha no valida, muestra un guion medio (-)
  if (date !== null && date !== undefined) {
    return isValid(new Date(date))
      ? format(new Date(fDateWithoutUTC(date)), 'dd-MM-yyyy')
      : '-';
  }
  return '-';
}

export function fDateYYYYMMDD(date: DateStringNum | null) {
  // Da formato de AÑO-MES-DIA a la fecha
  return date !== null ? format(new Date(date), 'yyyy-MM-dd') : null;
}

export function controlMaxDate(max: any, date: any) {
  const dateFormated = format(new Date(date), 'yyyy-MM-dd');
  const maxDate = format(new Date(max), 'yyyy-MM-dd');

  if (date === null || date === 'Invalid Date') {
    return null;
  }

  if (isValid(new Date(date)) && maxDate >= dateFormated) {
    return date;
  }

  if (isValid(new Date(date)) && !!max) {
    return fDateWithoutUTC(maxDate);
  }

  return date;
}

export function controlMinDate(min: any, date: any) {
  const dateFormated = format(new Date(date), 'yyyy-MM-dd');
  const minDate = format(new Date(min), 'yyyy-MM-dd');

  if (date === null || date === 'Invalid Date') {
    return null;
  }

  if (isValid(new Date(date)) && minDate <= dateFormated) {
    return date;
  }

  if (isValid(new Date(date)) && !!min) {
    return fDateWithoutUTC(minDate);
  }

  return date;
}
