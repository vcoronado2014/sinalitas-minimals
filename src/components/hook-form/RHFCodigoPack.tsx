import * as React from 'react';
import { IMaskInput } from 'react-imask';
import { TextField, TextFieldProps } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
let valid = false

const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
  (props, ref) => {

    const { onChange, ...other } = props;

    function isValidRUN(run: string) {
      // if (run.length !== 13) return false;

/*       let rv = false;
      let resultado = 0;
      const cuit_nro = cuit.replace("-", "");
      const codes = "6789456789";
      // eslint-disable-next-line radix
      const verificador = parseInt(cuit_nro[cuit_nro.length - 1]);
      let x = 0;

      while (x < 10) {
        // eslint-disable-next-line radix
        let digitoValidador = parseInt(codes.substring(x, x + 1));
        if (Number.isNaN(digitoValidador)) digitoValidador = 0;
        // eslint-disable-next-line radix
        let digito = parseInt(cuit_nro.substring(x, x + 1));
        if (Number.isNaN(digito)) digito = 0;
        const digitoValidacion = digitoValidador * digito;
        resultado += digitoValidacion;
        // eslint-disable-next-line no-plusplus
        x++;
      }
      resultado %= 11;
      rv = (resultado === verificador);
      valid = rv */
      valid = true;
      return valid
    }

    const patternDefinitions: { [key: string]: RegExp } = {
        '9': /[0-9]/,
        'A': /[A-Za-z]/,
      };

    return (
      <IMaskInput
        {...other}
        mask="99999999-A/9/A"
/*         definitions={
            {
                // @ts-ignore
                '9': /[0-9]/, 
                'A': /[A-Za-z]/,   
        }} */
        // definitions={patternDefinitions}
        inputRef={ref as React.RefCallback<HTMLTextAreaElement | HTMLInputElement>}
        onAccept={
          (value: any) => {
            onChange({ target: { name: props.name, value } })
            isValidRUN(value)
          }}
        overwrite
      />
    );
  },
);

type IProps = {
  name: string;
};

type Props = IProps & TextFieldProps;

export default function RHFCodigoPack({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error?.message}
          {...other}
          InputProps={{
            inputComponent: TextMaskCustom as any,
          }}
        />)}
    />
  );
}