using System;
using System.Collections.Generic;

namespace Inmoviral3._0
{
    public class PublicacionCompleta
    {
        // --- Datos de 'publicaciones' ---
        public int ID_Publicacion { get; set; }

        public int Id_Usuario { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public string Municipio { get; set; }
        public string Colonia { get; set; }
        public string TipoPropiedad { get; set; }
        public string Operacion { get; set; }
        public string Antiguedad { get; set; }
        public decimal M2_Terreno { get; set; }
        public decimal M2_Construccion { get; set; }
        public int Recamaras { get; set; }
        public int Banos { get; set; }
        public int Medios_Banos { get; set; }
        public int Estacionamiento { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }

        // --- Datos del Agente (de la tabla 'usuarios') ---
        public string NombreAgente { get; set; }
        public string ApellidosAgente { get; set; }
        public string CorreoAgente { get; set; }
        public string TelefonoAgente { get; set; }
        public string UsuarioAgente { get; set; } // ¡Esta línea es necesaria!

        // --- Listas de tablas relacionadas ---
        public List<string> Imagenes { get; set; }
        public List<string> Amenidades { get; set; }

        // --- Constructor ---
        public PublicacionCompleta()
        {
            Imagenes = new List<string>();
            Amenidades = new List<string>();
        }
    }
}