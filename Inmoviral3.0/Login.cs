using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    public partial class frmLogin : Form
    {
        // Variable para saber de dónde vino
        public string Origen { get; set; } = "Menu";

        // --- NUEVA VARIABLE: Para guardar el ID de la casa si viene de una publicación ---
        public int IdParaRedireccion { get; set; } = 0;

        public frmLogin()
        {
            InitializeComponent();
        }

        private void Login_Load(object sender, EventArgs e)
        {
            this.ActiveControl = btnRegistroTab;
        }

        private void btnIniciarSesion_Click(object sender, EventArgs e)
        {
            string usuario = txtUsuario.Text;
            string password = txtPassword.Text;

            try
            {
                Control control = new Control();
                Usuarios datosUsuario = control.ctrlLogin(usuario, password);

                if (datosUsuario != null)
                {
                    // --- LÓGICA DE REDIRECCIÓN ---
                    if (this.Origen == "Comprar")
                    {
                        frmComprar form = new frmComprar(datosUsuario);
                        form.Show();
                    }
                    else if (this.Origen == "Rentar")
                    {
                        frmRentar form = new frmRentar(datosUsuario);
                        form.Show();
                    }
                    else if (this.Origen == "Servicios")
                    {
                        Servicios form = new Servicios(datosUsuario);
                        form.Show();
                    }
                    else if (this.Origen == "Conocenos")
                    {
                        Conocenos form = new Conocenos(datosUsuario);
                        form.Show();
                    }
                    // --- AQUÍ ESTÁ LA MAGIA: VOLVER A LA PUBLICACIÓN ---
                    else if (this.Origen == "Publicacion")
                    {
                        // Abrimos la misma casa (usando el ID guardado) pero ahora con el usuario logueado
                        frmPublicacion form = new frmPublicacion(this.IdParaRedireccion, datosUsuario);
                        form.Show();
                    }
                    // ---------------------------------------------------
                    else
                    {
                        frmMenuPrincipal menu = new frmMenuPrincipal(datosUsuario);
                        menu.Show();
                    }

                    this.Close();
                }
                else
                {
                    MessageBox.Show("Usuario y/o contraseña incorrectas.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btnRegistroTab_Click(object sender, EventArgs e)
        {
            frmRegistro formRegistro = new frmRegistro();
            formRegistro.Show();
            this.Hide();
        }

        // Placeholders y otros
        private void TextBox_Enter(object sender, EventArgs e) { TextBox t = sender as TextBox; if (t.Tag != null && t.Text == t.Tag.ToString()) { t.Text = ""; t.ForeColor = System.Drawing.SystemColors.WindowText; } }
        private void TextBox_Leave(object sender, EventArgs e) { TextBox t = sender as TextBox; if (t.Tag != null && string.IsNullOrWhiteSpace(t.Text)) { t.Text = t.Tag.ToString(); t.ForeColor = System.Drawing.SystemColors.GrayText; } }
        private void labelmenup_Click(object sender, EventArgs e) { frmMenuPrincipal menu = new frmMenuPrincipal(); menu.Show(); this.Close(); }
        private void pictureBox1_Click(object sender, EventArgs e) { }
    }
}