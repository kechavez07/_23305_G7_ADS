// src/application/proxies/logging.proxy.ts


import { IUseCase } from "../use-cases/iuse-case";

// Este es nuestro Proxy. Implementa la misma interfaz genérica.
export class LoggingProxy<TRequest, TResponse> implements IUseCase<TRequest, TResponse> {
  
  // Recibe el caso de uso "real" que va a envolver.
  constructor(private readonly useCase: IUseCase<TRequest, TResponse>) {}

  // Este es el método que el cliente llamará.
  async execute(request?: TRequest): Promise<TResponse> {
    // 1. LÓGICA ANTES de la ejecución (Logging de entrada)
    console.log(`[LoggingProxy] ==> Executing use case: ${this.useCase.constructor.name}`);
    if (request) {
      console.log(`[LoggingProxy] ==> With request data:`, JSON.stringify(request, null, 2));
    }

    try {
      // 2. DELEGACIÓN: Llama al método execute del caso de uso real.
      const result = await this.useCase.execute(request);

      // 3. LÓGICA DESPUÉS de la ejecución exitosa (Logging de salida)
      console.log(`[LoggingProxy] <== Use case ${this.useCase.constructor.name} executed successfully.`);
      
      return result;

    } catch (error: any) {
      // 4. LÓGICA en caso de error (Logging de error)
      console.error(`[LoggingProxy] <== ERROR in use case ${this.useCase.constructor.name}:`, error.message);
      
      // Re-lanza el error para que el controlador pueda manejarlo
      throw error;
    }
  }
}