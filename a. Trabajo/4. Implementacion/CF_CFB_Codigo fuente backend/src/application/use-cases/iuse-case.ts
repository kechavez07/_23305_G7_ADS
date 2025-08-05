
/**
 * Interface for application use cases.
 * 
 * @template TRequest - Tipo de los datos de entrada (ej. un DTO).
 * @template TResponse - Tipo de los datos de salida (ej. un User o un mensaje).
 *
 * Implementa el patrón de caso de uso, definiendo el método `execute` que recibe opcionalmente una solicitud
 * y retorna una promesa con la respuesta.
 */
export interface IUseCase<TRequest, TResponse> {
  execute(request?: TRequest): Promise<TResponse>;
}