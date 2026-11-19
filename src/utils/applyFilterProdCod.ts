import { IProductoCodigoGrilla } from "src/@types/productoCodigoGrilla";

export function applyFilter({
    inputData,
    comparator,
    filterTexto,
  }: {
    inputData: IProductoCodigoGrilla[];
    comparator: (a: any, b: any) => number;
    filterTexto: string;
  }) {

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
  
    inputData = stabilizedThis.map((el) => el[0]);

    if (filterTexto) {
      inputData = inputData.filter(
        (prod) => prod.Texto.toLowerCase().indexOf(filterTexto.toLowerCase()) !== -1
      );
    }

    return inputData;

  }