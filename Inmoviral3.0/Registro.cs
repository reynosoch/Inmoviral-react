// EN Form1.cs - REEMPLAZA TODO CON ESTO

using System;
using System.Windows.Forms;
using MySql.Data.MySqlClient;

namespace Inmoviral3._0
{
    public partial class frmRegistro : Form
    {
        public frmRegistro()
        {
            InitializeComponent();
            // El botón de registrar empieza deshabilitado
            btnRegistrar.Enabled = false;
        }

        private void btnRegistrar_Click(object sender, EventArgs e)
        {
            // --- CÓDIGO FINAL PARA REGISTRAR USUARIOS ---
            Usuarios usuario = new Usuarios();
            usuario.Usuario = txtUsuario.Text;
            usuario.Password = txtPassword.Text;
            usuario.ConPassword = txtConPassword.Text;
            usuario.Nombre = txtNombre.Text;

            //nuevo desmadre para la db
            usuario.Apellidos = txtApellidos.Text;
            usuario.CorreoElectronico = txtCorreo.Text;
            usuario.Telefono = txtTelefono.Text;

            try
            {
                Control control = new Control();
                string respuesta = control.ctrlRegistro(usuario);

                if (respuesta.Length > 0)
                {
                    // Usamos 'Aviso' y un ícono de información para mensajes que no son errores graves
                    MessageBox.Show(respuesta, "Aviso", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    MessageBox.Show("¡Usuario registrado exitosamente!", "Éxito", MessageBoxButtons.OK, MessageBoxIcon.Information);

                    // 1. Creamos una instancia del formulario de Login.
                    frmLogin formLogin = new frmLogin();

                    // 2. Mostramos el formulario de Login.
                    formLogin.Show();

                    // 3. Ocultamos el formulario de Registro actual.
                    this.Hide();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Ocurrió un error inesperado: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void label5_Click(object sender, EventArgs e)
        {

        }

        private void label6_Click(object sender, EventArgs e)
        {

        }

        private void frmRegistro_Load(object sender, EventArgs e)
        {
            // Establecemos el foco inicial en un botón para que no se seleccione ningún TextBox.
            this.ActiveControl = btnLoginTab;
        }

        private void btnRegistroTab_Click(object sender, EventArgs e)
        {

        }

        private void checkBox1_CheckedChanged(object sender, EventArgs e)
        {
            // El estado del botón (habilitado/deshabilitado) será el mismo
            // que el estado de la casilla (marcada/desmarcada).
            btnRegistrar.Enabled = chkTerminos.Checked;
        }

        private void txtUsuario_TextChanged(object sender, EventArgs e)
        {

        }

        // Método genérico para el evento Enter de CUALQUIER TextBox
        private void TextBox_Enter(object sender, EventArgs e)
        {
            TextBox tb = sender as TextBox; // Identificamos qué TextBox llamó al evento
                                            // Si el texto actual es el mismo que guardamos en el Tag...
            if (tb.Text == tb.Tag.ToString())
            {
                tb.Text = ""; // Lo borramos
                tb.ForeColor = SystemColors.WindowText; // Y lo ponemos negro
            }
        }

        // Método genérico para el evento Leave de CUALQUIER TextBox
        private void TextBox_Leave(object sender, EventArgs e)
        {
            TextBox tb = sender as TextBox; // Identificamos qué TextBox llamó al evento
                                            // Si el TextBox quedó vacío...
            if (string.IsNullOrWhiteSpace(tb.Text))
            {
                tb.Text = tb.Tag.ToString(); // Le devolvemos el texto guardado en el Tag
                tb.ForeColor = SystemColors.GrayText; // Y lo ponemos gris
            }
        }

        private void btnLoginTab_Click(object sender, EventArgs e)
        {
            frmLogin formLogin = new frmLogin();
            formLogin.Show();
            this.Hide();
        }

        private void labelmenup_Click(object sender, EventArgs e)
        {
            // Creamos una instancia del formulario del menú principal.
            frmMenuPrincipal menu = new frmMenuPrincipal();

            // Mostramos el menú.
            menu.Show();

            // Ocultamos la ventana de registro actual.
            this.Hide();
        }

        private void txtNombre_KeyPress(object sender, KeyPressEventArgs e)
        {
            // Permite solo letras (incluyendo acentos y ñ), espacio y teclas de control.
            if (!char.IsLetter(e.KeyChar) && !char.IsControl(e.KeyChar) && !char.IsWhiteSpace(e.KeyChar))
            {
                // Si la tecla presionada NO es letra, control o espacio, cancela la acción.
                e.Handled = true;
            }
        }

        private void txtApellidos_KeyPress(object sender, KeyPressEventArgs e)
        {
            // Permite solo letras (incluyendo acentos y ñ), espacio y teclas de control.
            if (!char.IsLetter(e.KeyChar) && !char.IsControl(e.KeyChar) && !char.IsWhiteSpace(e.KeyChar))
            {
                // Si la tecla presionada NO es letra, control o espacio, cancela la acción.
                e.Handled = true;
            }
        }

        private void txtTelefono_KeyPress(object sender, KeyPressEventArgs e)
        {
            // Permite solo números y teclas de control.
            if (!char.IsDigit(e.KeyChar) && !char.IsControl(e.KeyChar))
            {
                // Si la tecla presionada NO es número ni tecla de control, cancela la acción.
                e.Handled = true;
            }
        }

        private void txtNombre_TextChanged(object sender, EventArgs e)
        {

        }
    }
}