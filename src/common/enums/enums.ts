export enum Roles {
  ADMINISTRADOR = 'ADMINISTRADOR',
  INTERCAMBIADOR = 'INTERCAMBIADOR',
}

export enum EstatusObjeto {
  DISPONIBLE = 'Disponible', // El objeto está disponible para intercambio
  NO_DISPONIBLE = 'No Disponible', // El objeto no está disponible para intercambio
}

export enum EstatusPropuestaIntercambio {
  ENVIADA = 'Enviada', // La propuesta ha sido enviada, pero no ha sido aceptada ni rechazada
  ACEPTADA = 'Aceptada', // La propuesta fue aceptada
  RECHAZADA = 'Rechazada', // La propuesta fue rechazada
  CONCRETADA = 'Concretada', // La propuesta fue concretada (finalizaron el chat de forma satisfactoria)
  NO_CONCRETADA = 'No Concretada', // La propuesta no fue concretada (finalizaron el chat de forma no satisfactoria)
}
