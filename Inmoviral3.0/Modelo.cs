using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;

namespace Inmoviral3._0
{
    internal class Modelo
    {
        private MySqlConnection CrearConexionDirecta()
        {
            string servidor = "localhost";
            string puerto = "3306";
            string usuario = "root";
            string password = "1234";
            string bd = "inmoviraldb";
            return new MySqlConnection($"server={servidor};port={puerto};user id={usuario};password={password};database={bd};");
        }

        // --- LOGIN Y REGISTRO (ESTO ESTABA ROTO) ---

        public int registro(Usuarios usuario)
        {
            using (MySqlConnection miConexion = CrearConexionDirecta())
            {
                miConexion.Open();
                string sql = "INSERT INTO usuarios (usuario, password, nombre, apellidos, correo_electronico, telefono, id_tipo) VALUES (@usuario, @password, @nombre, @apellidos, @correo_electronico, @telefono, @id_tipo)";
                MySqlCommand comando = new MySqlCommand(sql, miConexion);
                comando.Parameters.AddWithValue("@usuario", usuario.Usuario);
                comando.Parameters.AddWithValue("@password", usuario.Password);
                comando.Parameters.AddWithValue("@nombre", usuario.Nombre);
                comando.Parameters.AddWithValue("@apellidos", usuario.Apellidos);
                comando.Parameters.AddWithValue("@correo_electronico", usuario.CorreoElectronico);
                comando.Parameters.AddWithValue("@telefono", usuario.Telefono);
                comando.Parameters.AddWithValue("@id_tipo", 2);
                return comando.ExecuteNonQuery();
            }
        }

        public Usuarios porUsuario(string usuario)
        {
            using (MySqlConnection miConexion = CrearConexionDirecta())
            {
                miConexion.Open();
                string sql = "SELECT id, usuario, password, nombre, id_tipo FROM usuarios WHERE usuario = @usuario";
                MySqlCommand comando = new MySqlCommand(sql, miConexion);
                comando.Parameters.AddWithValue("@usuario", usuario);
                MySqlDataReader reader = comando.ExecuteReader();
                Usuarios usr = null;
                if (reader.Read())
                {
                    usr = new Usuarios();
                    usr.Id = int.Parse(reader["id"].ToString());
                    usr.Usuario = reader["usuario"].ToString();
                    usr.Password = reader["password"].ToString();
                    usr.Nombre = reader["nombre"].ToString();
                    usr.Id_tipo = int.Parse(reader["id_tipo"].ToString());
                }
                return usr;
            }
        }

        public bool existeUsuario(string usuario)
        {
            using (MySqlConnection miConexion = CrearConexionDirecta())
            {
                miConexion.Open();
                string sql = "SELECT COUNT(*) FROM usuarios WHERE usuario = @usuario";
                MySqlCommand comando = new MySqlCommand(sql, miConexion);
                comando.Parameters.AddWithValue("@usuario", usuario);
                long count = (long)comando.ExecuteScalar();
                return count > 0;
            }
        }

        // --- PUBLICACIONES ---

        public long GuardarPublicacionCompleta(int idUsuario, string tipoPropiedad, string tipoOperacion, string municipio, string calleyNumero, string numExterior, string colonia, string cp, string coordenadas, string titulo, string descripcion, string precio, string antiguedad, List<string> listaRutasImagenes, string m2Construccion, string m2Terreno, string recamaras, string banos, string mediosBanos, string estacionamiento, List<string> listaAmenidades, List<string> listaServicios)
        {
            decimal precioDecimal = ParseDecimal(precio);
            decimal m2ConstruccionDecimal = ParseDecimal(m2Construccion);
            decimal m2TerrenoDecimal = ParseDecimal(m2Terreno);
            int recamarasInt = ParseInt(recamaras);
            int banosInt = ParseInt(banos);
            int mediosBanosInt = ParseInt(mediosBanos);
            int estacionamientoInt = ParseInt(estacionamiento);
            string latitud = "";
            string longitud = "";
            if (!string.IsNullOrWhiteSpace(coordenadas)) { var parts = coordenadas.Split(','); if (parts.Length == 2) { latitud = parts[0].Trim(); longitud = parts[1].Trim(); } }

            long nuevaPublicacionId = -1;
            MySqlConnection miConexion = CrearConexionDirecta();
            MySqlTransaction transaccion = null;
            try
            {
                miConexion.Open();
                transaccion = miConexion.BeginTransaction();
                string sqlInsert = @"INSERT INTO publicaciones (id_usuario, tipo_propiedad, operacion, Municipio, Calle, NumExterior, Colonia, CP, Latitud, Longitud, Precio, Estatus, Titulo, Descripcion, Antiguedad, M2_Construccion, M2_Terreno, Recamaras, Banos, Medios_Banos, Estacionamiento) VALUES (@id_usuario, @tipo_propiedad, @operacion, @Municipio, @Calle, @NumExterior, @Colonia, @CP, @Latitud, @Longitud, @Precio, 'Activa', @Titulo, @Descripcion, @Antiguedad, @M2_Construccion, @M2_Terreno, @Recamaras, @Banos, @Medios_Banos, @Estacionamiento);";
                MySqlCommand comando = new MySqlCommand(sqlInsert, miConexion, transaccion);
                comando.Parameters.AddWithValue("@id_usuario", idUsuario);
                comando.Parameters.AddWithValue("@tipo_propiedad", tipoPropiedad);
                comando.Parameters.AddWithValue("@operacion", tipoOperacion);
                comando.Parameters.AddWithValue("@Municipio", municipio);
                comando.Parameters.AddWithValue("@Calle", calleyNumero);
                comando.Parameters.AddWithValue("@NumExterior", numExterior);
                comando.Parameters.AddWithValue("@Colonia", colonia);
                comando.Parameters.AddWithValue("@CP", cp);
                comando.Parameters.AddWithValue("@Latitud", latitud);
                comando.Parameters.AddWithValue("@Longitud", longitud);
                comando.Parameters.AddWithValue("@Precio", precioDecimal);
                comando.Parameters.AddWithValue("@Titulo", titulo);
                comando.Parameters.AddWithValue("@Descripcion", descripcion);
                comando.Parameters.AddWithValue("@Antiguedad", antiguedad);
                comando.Parameters.AddWithValue("@M2_Construccion", m2ConstruccionDecimal);
                comando.Parameters.AddWithValue("@M2_Terreno", m2TerrenoDecimal);
                comando.Parameters.AddWithValue("@Recamaras", recamarasInt);
                comando.Parameters.AddWithValue("@Banos", banosInt);
                comando.Parameters.AddWithValue("@Medios_Banos", mediosBanosInt);
                comando.Parameters.AddWithValue("@Estacionamiento", estacionamientoInt);
                comando.ExecuteNonQuery();
                nuevaPublicacionId = comando.LastInsertedId;
                GuardarListaEnTabla(miConexion, transaccion, nuevaPublicacionId, listaAmenidades, "publicacion_amenidades", "amenidad");
                GuardarListaEnTabla(miConexion, transaccion, nuevaPublicacionId, listaRutasImagenes, "publicacion_imagenes", "ruta_imagen");
                GuardarListaEnTabla(miConexion, transaccion, nuevaPublicacionId, listaServicios, "publicacion_servicios", "servicio");
                transaccion.Commit();
                return nuevaPublicacionId;
            }
            catch (Exception ex) { transaccion?.Rollback(); throw new Exception("Error al guardar: " + ex.Message); }
            finally { miConexion.Close(); }
        }

        // En Modelo.cs

        public PublicacionCompleta GetPublicacionCompletaPorID(int idPublicacion)
        {
            PublicacionCompleta pub = new PublicacionCompleta();
            pub.ID_Publicacion = idPublicacion;

            using (MySqlConnection con = CrearConexionDirecta())
            {
                con.Open();
                MySqlCommand cmd;
                MySqlDataReader reader;

                // Nota: Nos aseguramos de traer 'id_usuario' (aunque p.* ya lo trae)
                string sqlPub = @"SELECT p.*, u.nombre, u.apellidos, u.correo_electronico, u.telefono, u.usuario 
                          FROM publicaciones p 
                          LEFT JOIN usuarios u ON p.id_usuario = u.id 
                          WHERE p.ID_Publicacion = @id";

                cmd = new MySqlCommand(sqlPub, con);
                cmd.Parameters.AddWithValue("@id", idPublicacion);
                reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    // --- ¡AQUÍ ESTÁ EL CAMBIO IMPORTANTE! ---
                    // Leemos el id_usuario de la BD y lo guardamos en la clase
                    pub.Id_Usuario = reader.GetInt32("id_usuario");
                    // ----------------------------------------

                    pub.Titulo = reader.IsDBNull(reader.GetOrdinal("Titulo")) ? "" : reader.GetString("Titulo");
                    pub.Descripcion = reader.IsDBNull(reader.GetOrdinal("Descripcion")) ? "" : reader.GetString("Descripcion");
                    pub.Precio = reader.IsDBNull(reader.GetOrdinal("Precio")) ? 0 : reader.GetDecimal("Precio");
                    pub.Municipio = reader.IsDBNull(reader.GetOrdinal("Municipio")) ? "" : reader.GetString("Municipio");
                    pub.Colonia = reader.IsDBNull(reader.GetOrdinal("Colonia")) ? "" : reader.GetString("Colonia");
                    pub.TipoPropiedad = reader.IsDBNull(reader.GetOrdinal("tipo_propiedad")) ? "" : reader.GetString("tipo_propiedad");
                    pub.Antiguedad = reader.IsDBNull(reader.GetOrdinal("Antiguedad")) ? "" : reader.GetString("Antiguedad");
                    pub.M2_Terreno = reader.IsDBNull(reader.GetOrdinal("M2_Terreno")) ? 0 : reader.GetDecimal("M2_Terreno");
                    pub.M2_Construccion = reader.IsDBNull(reader.GetOrdinal("M2_Construccion")) ? 0 : reader.GetDecimal("M2_Construccion");
                    pub.Recamaras = reader.IsDBNull(reader.GetOrdinal("Recamaras")) ? 0 : reader.GetInt32("Recamaras");
                    pub.Banos = reader.IsDBNull(reader.GetOrdinal("Banos")) ? 0 : reader.GetInt32("Banos");
                    pub.Medios_Banos = reader.IsDBNull(reader.GetOrdinal("Medios_Banos")) ? 0 : reader.GetInt32("Medios_Banos");
                    pub.Estacionamiento = reader.IsDBNull(reader.GetOrdinal("Estacionamiento")) ? 0 : reader.GetInt32("Estacionamiento");
                    pub.Latitud = reader.IsDBNull(reader.GetOrdinal("Latitud")) ? "" : reader.GetString("Latitud");
                    pub.Longitud = reader.IsDBNull(reader.GetOrdinal("Longitud")) ? "" : reader.GetString("Longitud");
                    pub.Operacion = reader.IsDBNull(reader.GetOrdinal("operacion")) ? "" : reader.GetString("operacion");
                    pub.NombreAgente = reader.IsDBNull(reader.GetOrdinal("nombre")) ? "" : reader.GetString("nombre");
                    pub.ApellidosAgente = reader.IsDBNull(reader.GetOrdinal("apellidos")) ? "" : reader.GetString("apellidos");
                    pub.CorreoAgente = reader.IsDBNull(reader.GetOrdinal("correo_electronico")) ? "" : reader.GetString("correo_electronico");
                    pub.TelefonoAgente = reader.IsDBNull(reader.GetOrdinal("telefono")) ? "" : reader.GetString("telefono");
                    pub.UsuarioAgente = reader.IsDBNull(reader.GetOrdinal("usuario")) ? "" : reader.GetString("usuario");
                }
                reader.Close();

                // Imágenes
                string sqlImg = "SELECT ruta_imagen FROM publicacion_imagenes WHERE id_publicacion = @id";
                cmd = new MySqlCommand(sqlImg, con);
                cmd.Parameters.AddWithValue("@id", idPublicacion);
                reader = cmd.ExecuteReader();
                while (reader.Read()) pub.Imagenes.Add(reader["ruta_imagen"].ToString());
                reader.Close();

                // Amenidades
                string sqlAmen = "SELECT amenidad FROM publicacion_amenidades WHERE id_publicacion = @id";
                cmd = new MySqlCommand(sqlAmen, con);
                cmd.Parameters.AddWithValue("@id", idPublicacion);
                reader = cmd.ExecuteReader();
                while (reader.Read()) pub.Amenidades.Add(reader["amenidad"].ToString());
                reader.Close();

                return pub;
            }
        }

        public int ActualizarPublicacionCompleta(PublicacionCompleta publicacion)
        {
            int filasAfectadas = 0;
            MySqlConnection miConexion = CrearConexionDirecta();
            MySqlTransaction transaccion = null;
            try
            {
                miConexion.Open();
                transaccion = miConexion.BeginTransaction();
                string sqlUpdatePub = @"UPDATE publicaciones SET Titulo = @Titulo, Descripcion = @Descripcion, Precio = @Precio, Municipio = @Municipio, Colonia = @Colonia, tipo_propiedad = @TipoPropiedad, operacion = @Operacion, Antiguedad = @Antiguedad, M2_Terreno = @M2_Terreno, M2_Construccion = @M2_Construccion, Recamaras = @Recamaras, Banos = @Banos, Medios_Banos = @Medios_Banos, Estacionamiento = @Estacionamiento, Latitud = @Latitud, Longitud = @Longitud WHERE ID_Publicacion = @ID_Publicacion";
                MySqlCommand cmdUpdatePub = new MySqlCommand(sqlUpdatePub, miConexion, transaccion);
                cmdUpdatePub.Parameters.AddWithValue("@Titulo", publicacion.Titulo);
                cmdUpdatePub.Parameters.AddWithValue("@Descripcion", publicacion.Descripcion);
                cmdUpdatePub.Parameters.AddWithValue("@Precio", publicacion.Precio);
                cmdUpdatePub.Parameters.AddWithValue("@Municipio", publicacion.Municipio);
                cmdUpdatePub.Parameters.AddWithValue("@Colonia", publicacion.Colonia);
                cmdUpdatePub.Parameters.AddWithValue("@TipoPropiedad", publicacion.TipoPropiedad);
                cmdUpdatePub.Parameters.AddWithValue("@Operacion", publicacion.Operacion);
                cmdUpdatePub.Parameters.AddWithValue("@Antiguedad", publicacion.Antiguedad);
                cmdUpdatePub.Parameters.AddWithValue("@M2_Terreno", publicacion.M2_Terreno);
                cmdUpdatePub.Parameters.AddWithValue("@M2_Construccion", publicacion.M2_Construccion);
                cmdUpdatePub.Parameters.AddWithValue("@Recamaras", publicacion.Recamaras);
                cmdUpdatePub.Parameters.AddWithValue("@Banos", publicacion.Banos);
                cmdUpdatePub.Parameters.AddWithValue("@Medios_Banos", publicacion.Medios_Banos);
                cmdUpdatePub.Parameters.AddWithValue("@Estacionamiento", publicacion.Estacionamiento);
                cmdUpdatePub.Parameters.AddWithValue("@Latitud", publicacion.Latitud);
                cmdUpdatePub.Parameters.AddWithValue("@Longitud", publicacion.Longitud);
                cmdUpdatePub.Parameters.AddWithValue("@ID_Publicacion", publicacion.ID_Publicacion);
                filasAfectadas += cmdUpdatePub.ExecuteNonQuery();

                string sqlDeleteAmen = "DELETE FROM publicacion_amenidades WHERE id_publicacion = @idPublicacion";
                MySqlCommand cmdDeleteAmen = new MySqlCommand(sqlDeleteAmen, miConexion, transaccion);
                cmdDeleteAmen.Parameters.AddWithValue("@idPublicacion", publicacion.ID_Publicacion);
                cmdDeleteAmen.ExecuteNonQuery();
                GuardarListaEnTabla(miConexion, transaccion, publicacion.ID_Publicacion, publicacion.Amenidades, "publicacion_amenidades", "amenidad");

                string sqlDeleteImg = "DELETE FROM publicacion_imagenes WHERE id_publicacion = @idPublicacion";
                MySqlCommand cmdDeleteImg = new MySqlCommand(sqlDeleteImg, miConexion, transaccion);
                cmdDeleteImg.Parameters.AddWithValue("@idPublicacion", publicacion.ID_Publicacion);
                cmdDeleteImg.ExecuteNonQuery();
                GuardarListaEnTabla(miConexion, transaccion, publicacion.ID_Publicacion, publicacion.Imagenes, "publicacion_imagenes", "ruta_imagen");

                transaccion.Commit();
                return filasAfectadas;
            }
            catch (Exception ex) { transaccion?.Rollback(); throw new Exception("Error al actualizar: " + ex.Message); }
            finally { miConexion.Close(); }
        }

        public DataTable ObtenerTodasLasPublicaciones()
        {
            using (MySqlConnection conexion = CrearConexionDirecta())
            {
                conexion.Open();
                string sql = @"SELECT p.ID_Publicacion, p.Titulo, p.Precio, p.Recamaras, p.Banos, p.M2_Terreno, p.Colonia, p.Municipio, (SELECT ruta_imagen FROM publicacion_imagenes WHERE id_publicacion = p.ID_Publicacion LIMIT 1) as Imagen FROM publicaciones p WHERE p.Estatus = 'Activa'";
                MySqlCommand cmd = new MySqlCommand(sql, conexion);
                MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                adapter.Fill(dt);
                return dt;
            }
        }

        public DataTable FiltrarPublicaciones(string busqueda, string operacion, string tipoInmueble, string precioRango, string cuartos)
        {
            using (MySqlConnection conexion = CrearConexionDirecta())
            {
                conexion.Open();
                string sql = @"SELECT p.ID_Publicacion, p.Titulo, p.Precio, p.Recamaras, p.Banos, p.M2_Terreno, p.Colonia, p.Municipio, (SELECT ruta_imagen FROM publicacion_imagenes WHERE id_publicacion = p.ID_Publicacion LIMIT 1) as Imagen FROM publicaciones p WHERE p.Estatus = 'Activa' ";

                if (!string.IsNullOrEmpty(busqueda) && busqueda != "Buscar por calle o colonia") sql += " AND (p.Calle LIKE @busqueda OR p.Colonia LIKE @busqueda OR p.Municipio LIKE @busqueda)";
                if (!string.IsNullOrEmpty(operacion))
                {
                    if (operacion == "Comprar") sql += " AND p.operacion = 'Venta'";
                    else if (operacion == "Rentar") sql += " AND p.operacion = 'Renta'";
                }
                if (!string.IsNullOrEmpty(tipoInmueble) && tipoInmueble != "Inmueble") sql += " AND p.tipo_propiedad = @tipo";
                if (!string.IsNullOrEmpty(cuartos) && cuartos != "Cuartos")
                {
                    if (cuartos.Contains("+")) sql += " AND p.Recamaras >= @cuartos";
                    else sql += " AND p.Recamaras = @cuartos";
                }
                if (!string.IsNullOrEmpty(precioRango) && precioRango != "Precio")
                {
                    string limpio = precioRango.Replace("$", "").Replace(",", "").Replace(" ", "");
                    if (limpio.Contains("+")) { string min = limpio.Replace("+", ""); sql += $" AND p.Precio >= {min}"; }
                    else if (limpio.Contains("-")) { string[] partes = limpio.Split('-'); if (partes.Length == 2) sql += $" AND p.Precio BETWEEN {partes[0]} AND {partes[1]}"; }
                }

                MySqlCommand cmd = new MySqlCommand(sql, conexion);
                if (!string.IsNullOrEmpty(busqueda) && busqueda != "Buscar por calle o colonia") cmd.Parameters.AddWithValue("@busqueda", "%" + busqueda + "%");
                if (!string.IsNullOrEmpty(tipoInmueble) && tipoInmueble != "Inmueble") cmd.Parameters.AddWithValue("@tipo", tipoInmueble);
                if (!string.IsNullOrEmpty(cuartos) && cuartos != "Cuartos") cmd.Parameters.AddWithValue("@cuartos", cuartos.Replace("+", ""));

                MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                adapter.Fill(dt);
                return dt;
            }
        }

        public void ToggleFavorito(int idUsuario, int idPublicacion, bool agregar)
        {
            using (MySqlConnection conexion = CrearConexionDirecta())
            {
                conexion.Open();
                string sql = agregar ? "INSERT IGNORE INTO favoritos (id_usuario, id_publicacion) VALUES (@uid, @pid)" : "DELETE FROM favoritos WHERE id_usuario = @uid AND id_publicacion = @pid";
                MySqlCommand cmd = new MySqlCommand(sql, conexion);
                cmd.Parameters.AddWithValue("@uid", idUsuario);
                cmd.Parameters.AddWithValue("@pid", idPublicacion);
                cmd.ExecuteNonQuery();
            }
        }

        public bool EsFavorito(int idUsuario, int idPublicacion)
        {
            using (MySqlConnection conexion = CrearConexionDirecta())
            {
                conexion.Open();
                string sql = "SELECT COUNT(*) FROM favoritos WHERE id_usuario = @uid AND id_publicacion = @pid";
                MySqlCommand cmd = new MySqlCommand(sql, conexion);
                cmd.Parameters.AddWithValue("@uid", idUsuario);
                cmd.Parameters.AddWithValue("@pid", idPublicacion);
                long count = (long)cmd.ExecuteScalar();
                return count > 0;
            }
        }

        // En Modelo.cs

        public DataTable ObtenerMisPublicaciones(int idUsuario)
        {
            using (MySqlConnection conexion = CrearConexionDirecta())
            {
                conexion.Open();
                // Agregué p.Precio, p.Recamaras, p.Banos, p.M2_Terreno explícitamente
                string sql = @"
            SELECT 
                p.ID_Publicacion, 
                p.Titulo, 
                p.Precio,           -- ¡AQUÍ ESTABA EL ERROR! Faltaba o estaba mal escrito
                p.Recamaras, 
                p.Banos, 
                p.M2_Terreno, 
                p.Colonia, 
                p.Municipio,
                IFNULL((SELECT ruta_imagen FROM publicacion_imagenes WHERE id_publicacion = p.ID_Publicacion LIMIT 1), '') as Imagen
            FROM publicaciones p
            WHERE p.id_usuario = @uid";

                MySqlCommand cmd = new MySqlCommand(sql, conexion);
                cmd.Parameters.AddWithValue("@uid", idUsuario);
                MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                adapter.Fill(dt);
                return dt;
            }
        }

        public DataTable ObtenerFavoritos(int idUsuario)
        {
            using (MySqlConnection conexion = CrearConexionDirecta())
            {
                conexion.Open();
                string sql = @"
            SELECT 
                p.ID_Publicacion, 
                p.Titulo, 
                p.Precio,           -- ¡AQUÍ TAMBIÉN!
                p.Recamaras, 
                p.Banos, 
                p.M2_Terreno, 
                p.Colonia, 
                p.Municipio,
                IFNULL((SELECT ruta_imagen FROM publicacion_imagenes WHERE id_publicacion = p.ID_Publicacion LIMIT 1), '') as Imagen
            FROM publicaciones p
            INNER JOIN favoritos f ON p.ID_Publicacion = f.id_publicacion
            WHERE f.id_usuario = @uid AND p.Estatus = 'Activa'";

                MySqlCommand cmd = new MySqlCommand(sql, conexion);
                cmd.Parameters.AddWithValue("@uid", idUsuario);
                MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                adapter.Fill(dt);
                return dt;
            }
        }

        // En Modelo.cs

        public void EliminarPublicacion(int idPublicacion)
        {
            using (MySqlConnection conexion = CrearConexionDirecta())
            {
                conexion.Open();

                // Esta instrucción borra la casa. 
                // Si configuraste bien tu base de datos, también borrará las fotos y favoritos asociados automáticamente.
                string sql = "DELETE FROM publicaciones WHERE ID_Publicacion = @id";

                MySqlCommand cmd = new MySqlCommand(sql, conexion);
                cmd.Parameters.AddWithValue("@id", idPublicacion);

                cmd.ExecuteNonQuery();
            }
        }

        private void GuardarListaEnTabla(MySqlConnection con, MySqlTransaction trans, long idPublicacion, List<string> lista, string nombreTabla, string nombreColumna)
        {
            if (lista == null || lista.Count == 0) return;
            string sql = $"INSERT INTO {nombreTabla} (id_publicacion, {nombreColumna}) VALUES (@idPublicacion, @valor)";
            foreach (string item in lista)
            {
                MySqlCommand cmd = new MySqlCommand(sql, con, trans);
                cmd.Parameters.AddWithValue("@idPublicacion", idPublicacion);
                cmd.Parameters.AddWithValue("@valor", item);
                cmd.ExecuteNonQuery();
            }
        }

        private decimal ParseDecimal(string valor)
        {
            if (decimal.TryParse(valor, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal res)) return res;
            if (decimal.TryParse(valor, NumberStyles.Any, CultureInfo.CurrentCulture, out res)) return res;
            return 0m;
        }
        private int ParseInt(string valor) { if (int.TryParse(valor, out int res)) return res; return 0; }
    }
}