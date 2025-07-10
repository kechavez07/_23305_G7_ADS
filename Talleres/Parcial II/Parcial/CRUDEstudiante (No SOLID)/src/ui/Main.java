package ui;

import controller.EstudianteController;
import model.Estudiante;

import java.util.Scanner;

/**
 * Clase principal que actúa como vista de consola del sistema.
 */
public class Main {
    public static void main(String[] args) {
        EstudianteController controller = new EstudianteController();
        Scanner scanner = new Scanner(System.in);

        int opcion;
        do {
            System.out.println("\n------ MENÚ CRUD ESTUDIANTES ------");
            System.out.println("1. Crear estudiante");
            System.out.println("2. Mostrar todos los estudiantes");
            System.out.println("3. Actualizar estudiante");
            System.out.println("4. Eliminar estudiante");
            System.out.println("5. Salir");
            System.out.print("Seleccione una opción: ");
            opcion = scanner.nextInt();

            switch (opcion) {
                case 1 -> {
                    System.out.print("Ingrese ID: ");
                    int id = scanner.nextInt();
                    scanner.nextLine(); // Limpiar buffer
                    System.out.print("Ingrese apellidos: ");
                    String apellidos = scanner.nextLine();
                    System.out.print("Ingrese nombres: ");
                    String nombres = scanner.nextLine();
                    System.out.print("Ingrese edad: ");
                    int edad = scanner.nextInt();

                    controller.crearEstudiante(id, apellidos, nombres, edad);
                    System.out.println("Estudiante creado exitosamente.");
                }

                case 2 -> {
                    System.out.println("------ Lista de Estudiantes ------");
                    for (Estudiante e : controller.obtenerTodos()) {
                        System.out.println(e.getId() + " - " + e.getApellidos() + " " + e.getNombres() + " - Edad: "
                                + e.getEdad());
                    }
                }

                case 3 -> {
                    System.out.print("Ingrese el ID del estudiante a actualizar: ");
                    int id = scanner.nextInt();
                    scanner.nextLine(); // Limpiar buffer

                    System.out.print("Nuevo apellido: ");
                    String apellidos = scanner.nextLine();
                    System.out.print("Nuevo nombre: ");
                    String nombres = scanner.nextLine();
                    System.out.print("Nueva edad: ");
                    int edad = scanner.nextInt();

                    controller.actualizarEstudiante(id, apellidos, nombres, edad);
                    System.out.println("Estudiante actualizado correctamente.");
                }

                case 4 -> {
                    System.out.print("Ingrese el ID del estudiante a eliminar: ");
                    int id = scanner.nextInt();
                    controller.eliminarEstudiante(id);
                    System.out.println("Estudiante eliminado.");
                }

                case 5 -> System.out.println("Saliendo del programa...");

                default -> System.out.println("Opción no válida. Intente nuevamente.");
            }

        } while (opcion != 5);

        scanner.close();
    }
}
