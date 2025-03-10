export interface IBaseObject {
  id: number
  esBorrado: boolean
}

export interface IBaseInput {
  label: string
  placeholder?: string
  type: 'email' | 'text' | 'number' | 'password' | 'textarea' | 'select' | 'file' | 'date' | 'checkbox'
  isRequired: boolean,
  model: string
  select?: {
    data: Array<{ [key: string]: any }>;
    paramKey: string;
    valueKey: string;
  };
  isDisabled?:boolean
  }
