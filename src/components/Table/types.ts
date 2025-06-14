import { TableCellProps } from "@mui/material";
import { FormikProps } from "formik";
import * as Yup from 'yup';

export interface Column {
  accessor: string;
  header: string | (() => JSX.Element);
  cell?: (row: any, index: number, formik?: FormikProps<any>, loading?: boolean) => JSX.Element;
  thProps?: TableCellProps;
  editable?: boolean,
  inputProps?: {
    multiline: boolean;
    maxRows: number;
  }
}

export interface TableProps {
  columns: Column[],
  data: any,
  editableRows?: Record<number, boolean>,
  changeEditableRows?: (index: number, value: boolean) => void,
  validationSchema?: Yup.ObjectSchema<any>,
  onEditSubmit?: (row: any, index: number, values: any) => void,
  loading?: boolean
}