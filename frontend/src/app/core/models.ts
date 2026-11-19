export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}
export interface Pregunta {
  id: number;
  codigo: string;
  enunciado: string;
  opciones: string[];
}
export interface Respuesta {
  preguntaId: number;
  valor: string;
}
export interface RespuestaEvaluacion {
  preguntaId: number;
  pregunta: string;
  valor: string;
}
export interface Evaluacion {
  id: number;
  fecha: string;
  resumen: string;
  recomendaciones: string[];
  respuestas: RespuestaEvaluacion[];
}
export interface EvaluacionResumen {
  id: number;
  fecha: string;
  resumen: string;
}
