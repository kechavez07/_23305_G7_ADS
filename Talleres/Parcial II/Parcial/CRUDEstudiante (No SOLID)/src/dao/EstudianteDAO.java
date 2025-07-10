package dao;

import java.util.ArrayList;
import java.util.List;
import model.Estudiante;

/**
 * Clase que gestiona el almacenamiento y recuperación de estudiantes.
 */
public class EstudianteDAO {
    private List<Estudiante> estudiantes = new ArrayList<>();

    /**
     * Agrega un nuevo estudiante a la lista.
     *
     * @param e Estudiante a agregar.
     */
    public void agregar(Estudiante e) {
        estudiantes.add(e);
    }

    /**
     * Lista todos los estudiantes registrados.
     *
     * @return Lista de estudiantes.
     */
    public List<Estudiante> listar() {
        return estudiantes;
    }

    /**
     * Busca un estudiante por su ID.
     *
     * @param id ID del estudiante a buscar.
     * @return Estudiante encontrado o null si no existe.
     */
    public Estudiante buscarPorId(int id) {
        for (Estudiante e : estudiantes) {
            if (e.getId() == id) {
                return e;
            }
        }
        return null;
    }

    /**
     * Edita la información de un estudiante existente.
     *
     * @param nuevoEstudiante Estudiante con los datos actualizados.
     * @return true si se actualizó correctamente, false si no se encontró.
     */
    public boolean editar(Estudiante nuevoEstudiante) {
        for (int i = 0; i < estudiantes.size(); i++) {
            if (estudiantes.get(i).getId() == nuevoEstudiante.getId()) {
                estudiantes.set(i, nuevoEstudiante);
                return true;
            }
        }
        return false;
    }

    /**
     * Elimina un estudiante según su ID.
     *
     * @param id ID del estudiante a eliminar.
     * @return true si se eliminó correctamente, false si no se encontró.
     */
    public boolean eliminar(int id) {
        return estudiantes.removeIf(e -> e.getId() == id);
    }
}
