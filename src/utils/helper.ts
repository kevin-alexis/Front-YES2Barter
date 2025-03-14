export function formatDateToForm(date: Date){
  return new Date(date).toISOString().split('T')[0]
}

export function formatDateToView(date: Date){
  return new Date(date).toLocaleDateString('es-MX').split('T')[0]
}

export function formatTimeToView(date: Date){
  return new Date(date).toLocaleTimeString('es-MX', { hour: "2-digit", minute: "2-digit" }).split('T')[0]
}

export function enumFormat(enumData: any){
  const objeto = [];
  enumData.forEach((value, index) => objeto.push({id:index, name: value}));
  return objeto
}
