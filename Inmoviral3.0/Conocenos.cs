using System;
using System.Drawing;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    public partial class Conocenos : Form
    {
        private Usuarios usuarioLogueado;

        public Conocenos()
        {
            InitializeComponent();
            ConfigurarInicio();
        }

        public Conocenos(Usuarios usuario)
        {
            InitializeComponent();
            this.usuarioLogueado = usuario;
            ConfigurarInicio();
        }

        private void ConfigurarInicio()
        {
            if (panel5 != null) panel5.Visible = false; // O panel5, revisa el nombre en tu diseño
            if (btnlogin != null) btnlogin.Visible = true;
            if (picAvatar != null) picAvatar.Visible = false;
        }

        private void Conocenos_Load(object sender, EventArgs e)
        {
            // LÓGICA DE SESIÓN
            if (this.usuarioLogueado != null)
            {
                if (btnlogin != null) btnlogin.Visible = false;
                if (picAvatar != null) picAvatar.Visible = true;

                // Revisa si tu etiqueta se llama 'labelnombreuser' o 'nombreuser' en el diseño
                if (nombreuser != null)
                    nombreuser.Text = "Hola, " + usuarioLogueado.Usuario;
            }
            else
            {
                if (btnlogin != null) btnlogin.Visible = true;
                if (picAvatar != null) picAvatar.Visible = false;
            }
        }

        // --- IR AL LOGIN (CLAVE PARA QUE FUNCIONE) ---
        private void btnlogin_Click(object sender, EventArgs e)
        {
            frmLogin login = new frmLogin();
            // ¡AQUÍ LE DECIMOS QUE VENIMOS DE CONOCENOS!
            login.Origen = "Conocenos";
            login.Show();
            this.Close();
        }

        // --- NAVEGACIÓN ---
        private void label1_Click(object sender, EventArgs e) // Comprar
        {
            frmComprar comprar = new frmComprar(this.usuarioLogueado);
            comprar.Show();
            this.Close();
        }

        private void label4_Click(object sender, EventArgs e) // Rentar
        {
            frmRentar rentar = new frmRentar(this.usuarioLogueado);
            rentar.Show();
            this.Close();
        }

        private void label5_Click(object sender, EventArgs e) // Servicios
        {
            Servicios servicios = new Servicios(this.usuarioLogueado);
            servicios.Show();
            this.Close();
        }

        private void pictureBox1_Click(object sender, EventArgs e) // Menú Principal
        {
            frmMenuPrincipal menu = new frmMenuPrincipal(this.usuarioLogueado);
            menu.Show();
            this.Close();
        }

        private void button1_Click(object sender, EventArgs e) // Publicar
        {
            if (this.usuarioLogueado == null)
            {
                MessageBox.Show("Debes iniciar sesión para publicar.");
                return;
            }
            frmMenuPrincipal menuOwner = new frmMenuPrincipal(this.usuarioLogueado);
            frmPublicar publicar = new frmPublicar(menuOwner, this.usuarioLogueado);
            publicar.Show();
            this.Close();
        }

        // --- AVATAR ---
        private void picAvatar_Click(object sender, EventArgs e)
        {
            if (panel5 == null) return; // Asegúrate que sea el nombre correcto del panel
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

        protected override void OnFormClosed(FormClosedEventArgs e) { base.OnFormClosed(e); }
    }
}