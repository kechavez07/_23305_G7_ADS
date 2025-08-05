import { User , Patient} from "@prisma/client";
import { RegisterUserDto } from "../../application/dtos/auth.dtos";

// La interfaz define los métodos que cualquier repositorio de usuarios debe implementar.
// Esto nos permite cambiar la base de datos (de Prisma a otra) sin cambiar la lógica de negocio.
export interface IUserRepository {
  /**
   * Crea un nuevo usuario en la base de datos.
   * @param userData - Los datos del usuario a registrar.
   * @returns El usuario creado, sin la contraseña.
   */
  create(userData: RegisterUserDto & { password_hash: string }): Promise<Omit<User, 'password_hash'>>;

  /**
   * Busca un usuario por su dirección de correo electrónico.
   * @param email - El correo electrónico del usuario a buscar.
   * @returns El usuario encontrado o null si no existe.
   */
  findByEmail(email: string): Promise<User | null>;


  /**
   * Busca un usuario por su ID.
   * @param id - El ID del usuario a buscar.
   * @returns El usuario encontrado o null si no existe.
   */
  findById(id: string): Promise<(User & { representative_for: Patient[] }) | null>;
}