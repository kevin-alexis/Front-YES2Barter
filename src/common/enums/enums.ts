export enum Roles {
  ADMINISTRADOR = 'ADMINISTRADOR',
  INTERCAMBIADOR = 'INTERCAMBIADOR',
}

export enum EstatusObjeto {
  DISPONIBLE = 'DISPONIBLE', // El objeto está disponible para intercambio
  NO_DISPONIBLE = 'NO_DISPONIBLE', // El objeto no está disponible para intercambio
}

export enum EstatusPropuestaIntercambio {
  ENVIADA = 'ENVIADA', // La propuesta ha sido enviada, pero no ha sido aceptada ni rechazada
  ACEPTADA = 'ACEPTADA', // La propuesta fue aceptada
  RECHAZADA = 'RECHAZADA', // La propuesta fue rechazada
  CONCRETADA = 'CONCRETADA', // La propuesta fue concretada (finalizaron el chat de forma satisfactoria)
  NO_CONCRETADA = 'NO_CONCRETADA', // La propuesta no fue concretada (finalizaron el chat de forma no satisfactoria)
}
