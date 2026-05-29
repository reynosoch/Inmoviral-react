// Usuarios.cs - CORREGIDO
namespace Inmoviral3._0
{
    public class Usuarios
    {
        // CORRECCIÓN: Inicializamos las variables para evitar advertencias de nulos
        int id, id_tipo;
        string usuario = string.Empty;
        string password = string.Empty;
        string conPassword = string.Empty;
        string nombre = string.Empty;

        public string Usuario { get => usuario; set => usuario = value; }
        public string Password { get => password; set => password = value; }
        public string ConPassword { get => conPassword; set => conPassword = value; }
        public string Nombre { get => nombre; set => nombre = value; }
        public int Id { get => id; set => id = value; }
        public int Id_tipo { get => id_tipo; set => id_tipo = value; }

        //nuevo desmadre para la db
        public string Apellidos { get; set; } = string.Empty;
        public string CorreoElectronico { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
    }
}