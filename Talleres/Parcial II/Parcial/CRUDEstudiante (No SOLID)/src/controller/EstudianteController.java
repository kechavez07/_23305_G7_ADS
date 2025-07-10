package controller;

import dao.EstudianteDAO;
import model.Estudiante;
import java.util.List;

/**
 * Controlador que coordina las operaciones entre la vista y el modelo.
 */
public class EstudianteController {
    private EstudianteDAO dao = new EstudianteDAO();

    /**
     * Crea y registra un nuevo estudiante.
     *
     * @param id        ID del estudiante.
     * @param apellidos Apellidos del estudiante.
     * @param nombres   Nombres del estudiante.
     * @param edad      Edad del estudiante.
     */
    public void crearEstudiante(int id, String apellidos, String nombres, int edad) {
        Estudiante e = new Estudiante(id, apellidos, nombres, edad);
        dao.agregar(e);
    }

    /**
     * Obtiene la lista de todos los estudiantes registrados.
     *
     * @return Lista de estudiantes.
     */
    public List<Estudiante> obtenerTodos() {
        return dao.listar();
    }

    /**
     * Busca un estudiante por su ID.
     *
     * @param id ID del estudiante.
     * @return Estudiante encontrado o null si no existe.
     */
    public Estudiante buscarEstudiante(int id) {
        return dao.buscarPorId(id);
    }

    /**
     * Actualiza los datos de un estudiante.
     *
     * @param id        ID del estudiante.
     * @param apellidos Nuevos apellidos.
     * @param nombres   Nuevos nombres.
     * @param edad      Nueva edad.
     * @return true si se actualizó correctamente, false si no se encontró.
     */
    public boolean actualizarEstudiante(int id, String apellidos, String nombres, int edad) {
        Estudiante actualizado = new Estudiante(id, apellidos, nombres, edad);
        return dao.editar(actualizado);
    }

    /**
     * Elimina un estudiante por su ID.
     *
     * @param id ID del estudiante.
     * @return true si se eliminó correctamente, false si no se encontró.
     */
    public boolean eliminarEstudiante(int id) {
        return dao.eliminar(id);
    }
}
