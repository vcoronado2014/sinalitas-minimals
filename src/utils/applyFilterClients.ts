import { IClientAccountGeneral } from "src/@types/client";

export function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterCity,
}: {
  inputData: IClientAccountGeneral[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterCity: string;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

/*   if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  } */
  if (filterName) {
    inputData = inputData.filter((user) => {
      const filter = filterName.toLowerCase().trim(); // Eliminar espacios en blanco al inicio y final del filtro
  
      // Convertir todas las propiedades a minúsculas y eliminar espacios en blanco al inicio y final
      const userName = user.names.toLowerCase().trim();
      const userFirstName = user.firstName.toLowerCase().trim();
      const userLastName = user.lastName.toLowerCase().trim();
  
      const fullName = `${userName} ${userFirstName} ${userLastName}`.toLowerCase().replace(/\s+/g, ' ').trim();

      return fullName.includes(filter);
    });
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterCity !== 'all') {
    inputData = inputData.filter((user) => user.city === filterCity);
  }

  return inputData;
}