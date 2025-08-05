# Backend - Sistema de Agendamiento de Citas SKIPUR

Este repositorio contiene el código fuente del backend para el sistema de agendamiento de citas de la Fundación SKIPUR. La API está construida con Node.js, Express, TypeScript y Prisma, siguiendo los principios de Clean Architecture para garantizar un código mantenible, escalable y robusto.

## Sprint 1 Finalizado

Este primer sprint sienta las bases fundamentales de la aplicación, completando las siguientes funcionalidades:

### Funcionalidades Implementadas

*   **Arquitectura y Configuración:**
    *   Proyecto inicializado con **TypeScript** y **Express**.
    *   Integración con **Prisma ORM** para la gestión de la base de datos **PostgreSQL**.
    *   Estructura de proyecto basada en **Clean Architecture**, separando dominio, aplicación e infraestructura.
    *   Configuración de base de datos compartida en la nube (**Render**) para desarrollo colaborativo.

*   **Autenticación y Autorización (REQ001, REQ002):**
    *   **Registro de Usuarios (`POST /api/auth/register`):** Endpoint para que los clientes creen una cuenta. El sistema autogenera una contraseña segura.
    *   **Notificaciones por Correo:** Integración con **Nodemailer** para enviar un correo de bienvenida con la contraseña autogenerada al registrarse.
    *   **Inicio de Sesión (`POST /api/auth/login`):** Endpoint que valida credenciales y devuelve un **JSON Web Token (JWT)** para la autenticación de sesiones.
    *   **Middleware de Seguridad:** Implementación de un middleware robusto que verifica el JWT y autoriza el acceso a rutas basado en roles de usuario (`ADMIN`, `CLIENTE`, `ESPECIALISTA`).

*   **Gestión de Especialidades (REQ003):**
    *   **CRUD Completo** para la entidad `Specialty`.
    *   **`GET /api/specialties`:** Permite a todos los usuarios autenticados consultar la lista de especialidades disponibles.
    *   **`POST /api/specialties`:** Ruta protegida. Solo los usuarios con rol `ADMIN` pueden crear nuevas especialidades.
    *   **`PUT /api/specialties/:id`:** Ruta protegida. Solo los `ADMIN` pueden actualizar una especialidad existente.
    *   **`DELETE /api/specialties/:id`:** Ruta protegida. Solo los `ADMIN` pueden eliminar una especialidad.

---

## Guía de Instalación y Ejecución

Sigue estos pasos para levantar el proyecto en tu entorno de desarrollo local.

### Prerrequisitos

*   [Node.js](https://nodejs.org/) (versión 18 o superior)
*   [pnpm](https://pnpm.io/installation) (o `npm`/`yarn`)
*   [Git](https://git-scm.com/)

### 1. Clonar el Repositorio

```bash
git clone [URL de tu repositorio Git]
cd skipur-backend
```

### 2. Instalar Dependencias

Usa `pnpm` (recomendado) para instalar todos los paquetes necesarios.

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

1.  Crea una copia del archivo de ejemplo `.env.example` y renómbrala a `.env`.
    ```bash
    cp .env.example .env
    ```
2.  Abre el archivo `.env` y rellena las variables con las credenciales correspondientes. Estas deben ser solicitadas al líder del equipo, ya que **la base de datos de desarrollo es compartida**.

    ```.env
    # URL de conexión a la base de datos de desarrollo en Render
    DATABASE_URL="postgresql://user:password@host/database"

    # Credenciales para el envío de correos (usar una cuenta de Gmail con contraseña de aplicación)
    EMAIL_USER="tu_correo@gmail.com"
    EMAIL_PASS="tu_contraseña_de_aplicacion_de_16_caracteres"

    # Clave secreta para firmar los JSON Web Tokens
    JWT_SECRET="una_cadena_larga_y_aleatoria_para_la_seguridad"
    ```

### 4. Sincronizar la Base de Datos con Prisma

Para que tu cliente de Prisma local esté actualizado con el esquema de la base de datos, debes ejecutar el siguiente comando.

#### Generar el Cliente de Prisma

Este comando lee el `schema.prisma` y genera el cliente de TypeScript tipado para que puedas interactuar con la base de datos. **Debes ejecutarlo cada vez que hagas `git pull` y haya cambios en el `schema.prisma`**.

```bash
pnpm prisma generate
```

#### Aplicar Cambios en el Esquema (Migraciones)

**¡IMPORTANTE!** Como la base de datos de desarrollo es compartida, no debes ejecutar `prisma migrate dev` ya que podría intentar borrar y recrear la base de datos.

*   **Si necesitas aplicar nuevos cambios de `schema.prisma` a la base de datos compartida:**
    Utiliza el comando `db push`. Este comando sincroniza el esquema sin crear un archivo de migración formal y sin riesgo de borrar datos. **Coordina con tu equipo antes de ejecutarlo.**

    ```bash
    pnpm prisma db push
    ```

### 5. Iniciar el Servidor de Desarrollo

Una vez configurado, puedes iniciar el servidor.

```bash
pnpm run dev
```

El servidor se iniciará y estará escuchando en `http://localhost:3001` (o el puerto definido en tus variables de entorno). La aplicación se reiniciará automáticamente cada vez que guardes un cambio en un archivo.

---

## Próximos Pasos

*   Implementar pruebas unitarias y de integración.
*   Añadir la suite de pruebas E2E con Cypress (se ejecutará contra este backend).