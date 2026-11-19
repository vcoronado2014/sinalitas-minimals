import { useState } from 'react';
// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
// ----------------------------------------------------------------------

type Props = {
  isFiltered: boolean;
  optionsComuna: string[];
  onResetFilter: VoidFunction;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterComuna: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ClientTableToolbar({
  isFiltered,
  optionsComuna,
  onFilterName,
  onFilterComuna,
  onResetFilter,
}: Props) {
  const [name, setName] = useState<string>('')
  const [comuna, setComuna] = useState<string>('')

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    onFilterName(event)
  }

  const handleComuna = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComuna(event.target.value)
    onFilterComuna(event)
  }


  const handleReset = () => {
    setComuna('all')
    setName('')
    onResetFilter()
  }

  const sortedOptionsComuna = optionsComuna.slice(1).sort((a, b) => a.localeCompare(b));
  const updatedOptionsComuna = [optionsComuna[0], ...sortedOptionsComuna];

  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
        <TextField
        fullWidth
        select
        label="Comuna"
        value={comuna}
        onChange={handleComuna}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {updatedOptionsComuna.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={name}
        onChange={handleName}
        placeholder="Buscar..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={handleReset}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}