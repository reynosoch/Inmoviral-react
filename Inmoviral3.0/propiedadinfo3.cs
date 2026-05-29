// --- REEMPLAZA TODO EN propiedadinfo3.cs CON ESTO ---

using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    public partial class propiedadinfo3 : Form
    {
        // --- 1. Variables Miembro (para guardar TODO) ---
        private propiedadinfo2 ownerForm;
        private Usuarios usuarioLogueado;
        private string tipoPropiedad;
        private string tipoOperacion;
        private string municipio;
        private string calleyNumero;
        private string numExterior;
        private string colonia;
        private string cp;
        private string coordenadas;
        private string titulo;
        private string descripcion;
        private string precio;
        private string antiguedad;
        private List<string> listaRutasImagenes;

        // --- 2. Constructor (¡EL IMPORTANTE!) ---
        public propiedadinfo3(
            propiedadinfo2 owner,
            Usuarios usuario,
            string tipoProp,
            string tipoOp,
            string municipio,
            string calleyNumero,
            string numExterior,
            string colonia,
            string cp,
            string coordenadas,
            string titulo,
            string descripcion,
            string precio,
            string antiguedad,
            List<string> listaRutas)
        {
            InitializeComponent();

            // Guarda todos los datos recibidos
            this.ownerForm = owner;
            this.usuarioLogueado = usuario;
            this.tipoPropiedad = tipoProp;
            this.tipoOperacion = tipoOp;
            this.municipio = municipio;
            this.calleyNumero = calleyNumero;
            this.numExterior = numExterior;
            this.colonia = colonia;
            this.cp = cp;
            this.coordenadas = coordenadas;
            this.titulo = titulo;
            this.descripcion = descripcion;
            this.precio = precio;
            this.antiguedad = antiguedad;
            this.listaRutasImagenes = listaRutas;

            // (Aquí puedes usar los datos, ej: mostrar el usuario)
            if (this.usuarioLogueado != null && labelnombreuser != null)
            {
                labelnombreuser.Text = "Hola, " + this.usuarioLogueado.Usuario;
            }
        }

        // --- 3. Lógica del Formulario ---

        // Evento Load (¡CORREGIDO Y UNIFICADO!)
        private void propiedadinfo3_Load(object sender, EventArgs e)
        {
            // Oculta el panel de avatar al cargar
            if (panel2 != null)
            {
                panel2.Visible = false;
            }

            // Asigna el foco a un Label para que no se seleccione un TextBox
            this.ActiveControl = label7; // (Asegúrate que 'label7' exista en tu diseño)
        }

        // Botón de "Atrás" (ej: label13)
        // (Asegúrate de conectar esto al evento Click de tu botón 'Atrás')
        private void label13_Click(object sender, EventArgs e)
        {
            if (this.ownerForm != null)
            {
                this.ownerForm.Show(); // Muestra propiedadinfo2 de nuevo
            }
            this.Close();
        }

        // --- (Eventos del panel de Avatar) ---
        private void picAvatar_Click(object sender, EventArgs e)
        {
            Point screenPoint = picAvatar.PointToScreen(Point.Empty);
            Point formPoint = this.PointToClient(screenPoint);
            panel2.Left = formPoint.X - panel2.Width + picAvatar.Width;
            panel2.Top = formPoint.Y + picAvatar.Height;
            panel2.Visible = !panel2.Visible;
            panel2.BringToFront();
        }

        private void labelcerrarsesion_Click(object sender, EventArgs e)
        {
            frmMenuPrincipal menuPrincipalNuevo = new frmMenuPrincipal();
            menuPrincipalNuevo.Show();
            this.Close();
        }

        // --- (Eventos de Placeholders, para M2) ---
        private void TextBox_Enter(object sender, EventArgs e)
        {
            TextBox textBoxActual = sender as TextBox;
            if (textBoxActual.Tag != null && textBoxActual.Text == textBoxActual.Tag.ToString())
            {
                textBoxActual.Text = "";
                textBoxActual.ForeColor = SystemColors.WindowText;
            }
        }

        private void TextBox_Leave(object sender, EventArgs e)
        {
            TextBox textBoxActual = sender as TextBox;
            if (textBoxActual.Tag != null && string.IsNullOrWhiteSpace(textBoxActual.Text))
            {
                textBoxActual.Text = textBoxActual.Tag.ToString();
                textBoxActual.ForeColor = SystemColors.GrayText;
            }
        }

        // --- 4. LÓGICA DE CONTADORES ---

        /// <summary>
        /// Método reutilizable para cambiar el valor de un TextBox contador.
        /// </summary>
        private void ModificarContador(TextBox txt, int cantidad)
        {
            int valorActual = 0;
            int.TryParse(txt.Text, out valorActual);
            int nuevoValor = valorActual + cantidad;

            // Define el valor mínimo
            int minValor = 0;
            if (txt == textBox3 || txt == textBox4) // Recámaras (textBox3) y Baños (textBox4)
            {
                minValor = 1; // ¡CORREGIDO! Mínimo 1
            }
            // Para Medios Baños (textBox5) y Estacionamiento (textBox6), el mínimo es 0

            // Aplica el límite mínimo
            if (nuevoValor < minValor)
            {
                nuevoValor = minValor;
            }

            // Actualiza el TextBox
            txt.Text = nuevoValor.ToString();
        }

        // --- Eventos Click para los botones + / - ---
        // (Asegúrate de conectarlos en el Diseñador)

        // Recámaras (textBox3)
        private void pictureBox2_Click(object sender, EventArgs e) { ModificarContador(textBox3, -1); } // -
        private void pictureBox3_Click(object sender, EventArgs e) { ModificarContador(textBox3, +1); } // +

        // Baños (textBox4)
        private void pictureBox5_Click(object sender, EventArgs e) { ModificarContador(textBox4, -1); } // -
        private void pictureBox4_Click(object sender, EventArgs e) { ModificarContador(textBox4, +1); } // +

        // Medios Baños (textBox5)
        private void pictureBox7_Click(object sender, EventArgs e) { ModificarContador(textBox5, -1); } // -
        private void pictureBox6_Click(object sender, EventArgs e) { ModificarContador(textBox5, +1); } // +

        // Estacionamiento (textBox6)
        private void pictureBox9_Click(object sender, EventArgs e) { ModificarContador(textBox6, -1); } // -
        private void pictureBox8_Click(object sender, EventArgs e) { ModificarContador(textBox6, +1); } // +


        // --- 5. LÓGICA DE VALIDACIÓN DE TECLADO ---

        /// <summary>
        /// Evento KeyPress que solo permite números y teclas de control.
        /// </summary>
        private void txtNumeros_KeyPress(object sender, KeyPressEventArgs e)
        {
            // Verifica si la tecla presionada NO es un número Y NO es una tecla de control
            if (!char.IsDigit(e.KeyChar) && !char.IsControl(e.KeyChar))
            {
                // Si no es ninguna de las dos, cancela la tecla
                e.Handled = true;
            }
        }

        // --- 6. Lógica de Navegación (Botón "Continuar") ---
        // (Este es el método que estaba pegado al final, ahora está en su lugar)
        private void btnContinuar_Click(object sender, EventArgs e)
        {
            // --- 1. VALIDACIÓN de TextBoxes NUEVOS ---
            // Chequeo de M2 Construcción (textBox1)
            if (string.IsNullOrWhiteSpace(textBox1.Text) || (textBox1.Tag != null && textBox1.Text == textBox1.Tag.ToString()) || textBox1.Text == "0")
            {
                MessageBox.Show("Debes indicar los Metros Cuadrados de Construcción.");
                textBox1.Focus();
                return;
            }

            // Chequeo de M2 Terreno (textBox2)
            if (string.IsNullOrWhiteSpace(textBox2.Text) || (textBox2.Tag != null && textBox2.Text == textBox2.Tag.ToString()) || textBox2.Text == "0")
            {
                MessageBox.Show("Debes indicar los Metros Cuadrados de Terreno.");
                textBox2.Focus();
                return;
            }

            // --- 2. VALIDACIÓN de Contadores (Recámaras y Baños) ---
            if (string.IsNullOrWhiteSpace(textBox3.Text) || textBox3.Text == "0")
            {
                MessageBox.Show("Debes indicar al menos 1 recámara.");
                textBox3.Focus();
                return;
            }
            if (string.IsNullOrWhiteSpace(textBox4.Text) || textBox4.Text == "0")
            {
                MessageBox.Show("Debes indicar al menos 1 baño.");
                textBox4.Focus();
                return;
            }

            // --- 3. RECOLECCIÓN de TextBoxes ---
            string m2Construccion = textBox1.Text;
            string m2Terreno = textBox2.Text;
            string recamaras = textBox3.Text;
            string banos = textBox4.Text;
            string mediosBanos = textBox5.Text;
            string estacionamiento = textBox6.Text;


            // --- 4. NAVEGACIÓN (CON los nuevos campos) ---
            try
            {
                // Creamos la instancia del siguiente formulario
                propiedadinfo4 formSiguiente = new propiedadinfo4(
                    this,                     // El owner (propiedadinfo3)
                    this.usuarioLogueado,

                    // --- Datos de propiedadinfo1 ---
                    this.tipoPropiedad,
                    this.tipoOperacion,
                    this.municipio,
                    this.calleyNumero,
                    this.numExterior,
                    this.colonia,
                    this.cp,
                    this.coordenadas,

                    // --- Datos de propiedadinfo2 ---
                    this.titulo,
                    this.descripcion,
                    this.precio,
                    this.antiguedad,
                    this.listaRutasImagenes,

                    // --- Datos NUEVOS de propiedadinfo3 ---
                    m2Construccion,      // ¡NUEVO!
                    m2Terreno,           // ¡NUEVO!
                    recamaras,
                    banos,
                    mediosBanos,
                    estacionamiento
                );

                // Mostramos el siguiente formulario
                formSiguiente.Show();
                this.Hide();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error al abrir 'propiedadinfo4': " + ex.Message);
            }
        }

        private void propiedadinfo3_Load_1(object sender, EventArgs e)
        {
            this.ActiveControl = label2; // Reemplaza 'label7' si es otro
        }
    } // Fin de la clase
} // Fin del namespace