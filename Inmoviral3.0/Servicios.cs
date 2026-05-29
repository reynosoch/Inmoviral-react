using System;
using System.Drawing;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    public partial class Servicios : Form
    {
        private Usuarios usuarioLogueado;

        public Servicios()
        {
            InitializeComponent();
            ConfigurarInicio();
        }

        public Servicios(Usuarios usuario)
        {
            InitializeComponent();
            this.usuarioLogueado = usuario;
            ConfigurarInicio();
        }

        private void ConfigurarInicio()
        {
            if (panel5 != null) panel5.Visible = false;
            if (btnlogin != null) btnlogin.Visible = true;
            if (picAvatar != null) picAvatar.Visible = false;
        }

        private void Servicios_Load(object sender, EventArgs e)
        {
            if (this.usuarioLogueado != null)
            {
                if (btnlogin != null) btnlogin.Visible = false;
                if (picAvatar != null) picAvatar.Visible = true;

                // Asegúrate que en el diseño tu etiqueta se llame 'nombreuser'
                if (nombreuser != null) nombreuser.Text = "Hola, " + usuarioLogueado.Usuario;
            }
            else
            {
                if (btnlogin != null) btnlogin.Visible = true;
                if (picAvatar != null) picAvatar.Visible = false;
            }
        }

        // --- NAVEGACIÓN HEADER (LO QUE PEDISTE) ---

        // Label1 -> Ir a Comprar
        private void label1_Click(object sender, EventArgs e)
        {
            frmComprar comprar = new frmComprar(this.usuarioLogueado);
            comprar.Show();
            this.Close();
        }

        // Label4 -> Ir a Rentar
        private void label4_Click(object sender, EventArgs e)
        {
            frmRentar rentar = new frmRentar(this.usuarioLogueado);
            rentar.Show();
            this.Close();
        }

        // --- NAVEGACIÓN VOLVER AL MENÚ (PictureBox1) ---
        private void pictureBox1_Click(object sender, EventArgs e)
        {
            frmMenuPrincipal menu = new frmMenuPrincipal(this.usuarioLogueado);
            menu.Show();
            this.Close();
        }

        // --- BOTONES CONTINUAR/PUBLICAR ---
        private void btnContinuar_Click(object sender, EventArgs e) { IrAPublicar(); }
        private void button1_Click(object sender, EventArgs e) { IrAPublicar(); }

        private void IrAPublicar()
        {
            if (this.usuarioLogueado == null)
            {
                MessageBox.Show("Debes iniciar sesión para continuar.", "Aviso");
                return;
            }
            frmMenuPrincipal menuOwner = new frmMenuPrincipal(this.usuarioLogueado);
            frmPublicar publicar = new frmPublicar(menuOwner, this.usuarioLogueado);
            publicar.Show();
            this.Close();
        }

        // --- SESIÓN ---
        private void btnlogin_Click(object sender, EventArgs e)
        {
            frmLogin login = new frmLogin();
            login.Origen = "Servicios";
            login.Show();
            this.Close();
        }

        private void picAvatar_Click(object sender, EventArgs e)
        {
            if (panel5 == null) return;
            panel5.Parent = this;
            Point s = picAvatar.PointToScreen(Point.Empty);
            Point f = this.PointToClient(s);
            panel5.Left = f.X - panel5.Width + picAvatar.Width;
            panel5.Top = f.Y + picAvatar.Height;
            panel5.Visible = !panel5.Visible;
            panel5.BringToFront();
        }

        private void labelcerrarsesion_Click(object sender, EventArgs e)
        {
            frmMenuPrincipal menu = new frmMenuPrincipal();
            menu.Show();
            this.Close();
        }

        protected override void OnFormClosed(FormClosedEventArgs e)
        {
            base.OnFormClosed(e);
        }

        private void label6_Click(object sender, EventArgs e)
        {
            Conocenos formConocenos = new Conocenos(this.usuarioLogueado);
            formConocenos.Show();
            this.Hide();
        }
    }
}