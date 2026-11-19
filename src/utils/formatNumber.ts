/* eslint-disable no-nested-ternary */
import numeral from 'numeral';
import { isSomeTrue, isEqual } from './comparateValues';

// ----------------------------------------------------------------------

const lng = localStorage.getItem('i18nextLng');

numeral.register('locale', 'es-AR', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'mm',
    billion: 'b',
    trillion: 't'
  },
  ordinal(number) {
    const b = number % 10;
    // eslint-disable-next-line no-bitwise
    return (isSomeTrue(isEqual(b, 1), isEqual(b, 3))) ? 'er' :
      (isEqual(b, 2)) ? 'do' :
        (isSomeTrue(isEqual(b, 7), isEqual(b, 0))) ? 'mo' :
          (isEqual(b, 8)) ? 'vo' :
            (isEqual(b, 9)) ? 'no' : 'to';
  },
  currency: {
    symbol: '$'
  }
});

numeral.register('locale', 'en-gb', {
  delimiters: {
    thousands: ',',
    decimal: '.'
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  ordinal(number) {
    const b = number % 10;
    // eslint-disable-next-line no-bitwise
    return (~~(number % 100 / 10) === 1) ? 'th' :
      (isEqual(b, 1)) ? 'st' :
        (isEqual(b, 2)) ? 'nd' :
          (isEqual(b, 3)) ? 'rd' : 'th';
  },
  currency: {
    symbol: '$'
  }
});

numeral.locale(lng === 'es' ? 'es-AR' : 'en-gb');

// ----------------------------------------------------------------------

type InputValue = string | number | null;

export function fCurrency(number: InputValue) {
  // const format = number ? numeral(number).format('$0,0.00') : '';
  const format = number ? numeral(number).format('$ 0') : '';

  // return result(format, '.00');
  return result(format);
}

export function fPercent(number: InputValue) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}


export function fNumber(number: InputValue) {
  return numeral(number).format();
}


export function getNumDecimals(number: string | number) {
  // funcion para que agrege la cantidad total de decimales de un numero
  const indexOfDot = number.toString().indexOf('.');

  if (indexOfDot !== -1) {
    return number.toString().slice(indexOfDot + 1)
  }

  return ''

}

export function fNumberCurrency(number: string | number, currency: string) {
  // formatea el numero siempre a un maximo de 2 decimales, si el numero no tiene decimales agrega '',00''
  // agrega el simbolo de la moneda
  return numeral(number).format(`$ 0,0.00`).replace('$', currency);
}

export function fNumberCurrencyDecimals(number: string | number, currency: string) {
  // formatea el numero al numero de decimales que contenga y agrega el simbolo de la moneda
  return numeral(number).format(!number.toString().includes('.') ? `$ 0,0` : `$ 0,0.${getNumDecimals(number)}`).replace('$', currency);
}

export function fNumberDecimal(number: string | number) {
  // formatea el numero siempre a un maximo de 2 decimales, si el numero no tiene decimales agrega '',00''
  return numeral(number).format(`0,0.00`);
}

export function fShortenNumber(number: InputValue) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number: InputValue) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format: string, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

export function fStringToNumber(value: string | number | null, currency?: string) {
  // convierte numeros en formato de string, que contengan currency o no, a number para poder hacer calculos

  if (lng === 'es') {
    if (typeof value === 'string' && currency && value.includes(currency)) {
      return Number(value.replace(currency, ".").split('.').join('').replace(',', '.'))
    }
    if (typeof value === 'string' && value.includes('.')) {
      return Number(value.split('.').join('').replace(',', '.'))
    }
  } else {
    if (typeof value === 'string' && currency && value.includes(currency)) {
      return Number(value.replace(currency, ",").split(',').join(''))
    }
    if (typeof value === 'string' && value.includes(',')) {
      return Number(value.split(',').join(''))
    }
  }

  return Number(value)
}
