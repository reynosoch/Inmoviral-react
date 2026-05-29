// EN: Control.cs - CÓDIGO COMPLETO Y CORREGIDO

using System;
using System.Security.Cryptography;
using System.Text;
// using MySql.Data.MySqlClient; // No es necesario aquí, pero Modelo sí lo necesita
// using System.Collections.Generic; // No es necesario aquí, pero Modelo sí lo necesita

namespace Inmoviral3._0
{
    internal class Control
    {
        // --- LÓGICA DE REGISTRO COMPLETA (CON NUEVOS CAMPOS) ---
        public string ctrlRegistro(Usuarios usuario)
        {
            Modelo modelo = new Modelo();
            string respuesta = "";

            if (string.IsNullOrEmpty(usuario.Usuario) || string.IsNullOrEmpty(usuario.Password) ||
                string.IsNullOrEmpty(usuario.ConPassword) || string.IsNullOrEmpty(usuario.Nombre) ||
                string.IsNullOrEmpty(usuario.Apellidos) || string.IsNullOrEmpty(usuario.CorreoElectronico) ||
                string.IsNullOrEmpty(usuario.Telefono))
            {
                respuesta = "Todos los campos son obligatorios.";
            }
            else
            {
                if (usuario.Password == usuario.ConPassword)
                {
                    if (modelo.existeUsuario(usuario.Usuario))
                    {
                        respuesta = "El nombre de usuario ya existe.";
                    }
                    else
                    {
                        usuario.Password = generarSHA1(usuario.Password);
                        modelo.registro(usuario);
                        // Si no hay errores, la respuesta se queda vacía (éxito)
                    }
                }
                else
                {
                    respuesta = "Las contraseñas no coinciden.";
                }
            }
            return respuesta;
        }

        // --- LÓGICA DE LOGIN COMPLETA ---
        public Usuarios ctrlLogin(string usuario, string password)
        {
            Modelo modelo = new Modelo();
            Usuarios datosUsuario = modelo.porUsuario(usuario);

            if (datosUsuario != null)
            {
                if (datosUsuario.Password != generarSHA1(password))
                {
                    datosUsuario = null; // Contraseña incorrecta
                }
            }
            return datosUsuario; // Devuelve null si el usuario no existe o la contraseña es incorrecta
        }

        // --- LÓGICA DE ENCRIPTACIÓN COMPLETA (SHA1) ---
        private string generarSHA1(string cadena)
        {
            UTF8Encoding enc = new UTF8Encoding();
            byte[] data = enc.GetBytes(cadena);
            byte[] result;

            using (SHA1 sha = SHA1.Create())
            {
                result = sha.ComputeHash(data);
            }

            StringBuilder sb = new StringBuilder();
            foreach (byte b in result)
            {
                sb.Append(b.ToString("x2"));
            }
            return sb.ToString();
        }

    } // <-- ESTA ES LA LLAVE QUE FALTABA PARA CERRAR LA CLASE 'Control'
} // <-- Esta es la llave para cerrar el 'namespace'