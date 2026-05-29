using System;
using System.Drawing;
using System.Windows.Forms;
using System.Diagnostics; // IMPORTANTE: Necesario para abrir los links

namespace Inmoviral3._0
{
    public partial class frmMenuPrincipal : Form
    {
        private Usuarios usuarioLogueado;

        // --- CONSTRUCTOR 1 (Sin sesión) ---
        public frmMenuPrincipal()
        {
            InitializeComponent();
        }

        // --- CONSTRUCTOR 2 (Con sesión) ---
        public frmMenuPrincipal(Usuarios usuario)
        {
            InitializeComponent();
            this.usuarioLogueado = usuario;
        }

        // --- EVENTO LOAD ---
        private void frmMenuPrincipal_Load(object sender, EventArgs e)
        {
            // 1. Llenar las listas desplegables (Combos)
            LlenarCombosMenu();

            // 2. Configurar la vista según si hay usuario o no
            if (this.usuarioLogueado != null)
            {
                // --- MODO: USUARIO LOGUEADO ---
                if (labelnombreuser != null)
                {
                    labelnombreuser.Text = "Hola, " + usuarioLogueado.Usuario;
                    labelnombreuser.Cursor = Cursors.Hand;
                }

                if (picAvatar != null) picAvatar.Visible = true;
                if (btnlogin != null) btnlogin.Visible = false; // Ocultar botón de login

                // Botón PUBLICAR (Naranja)
                if (button1 != null)
                {
                    button1.Visible = true;
                    button1.BringToFront();
                }

                // Ocultar mensaje de advertencia
                if (label20 != null) label20.Visible = false;
            }
            else
            {
                // --- MODO: VISITANTE ---
                if (picAvatar != null) picAvatar.Visible = false;
                if (btnlogin != null) btnlogin.Visible = true;  // Mostrar botón login
                if (button1 != null) button1.Visible = false;   // Ocultar botón publicar
                if (label20 != null) label20.Visible = true;    // Mostrar mensaje
            }

            // Ocultar el panel de menú desplegable al inicio
            if (panel2 != null) panel2.Visible = false;
        }

        private void LlenarCombosMenu()
        {
            // Lógica de seguridad para llenar los combos solo si están vacíos
            if (comboBox2 != null && comboBox2.Items.Count == 0)
            {
                comboBox2.Items.Add("Venta");
                comboBox2.Items.Add("Rentar");
                comboBox2.SelectedIndex = 0;
            }
            if (comboBox3 != null && comboBox3.Items.Count == 0)
            {
                comboBox3.Items.Add("Casa");
                comboBox3.Items.Add("Departamento");
                comboBox3.Items.Add("Terreno");
                comboBox3.SelectedIndex = 0;
            }
        }

        // --- NAVEGACIÓN DEL MENÚ SUPERIOR ---

        private void label1_Click(object sender, EventArgs e)
        {
            frmComprar formComprar = new frmComprar(this.usuarioLogueado);
            formComprar.Show();
            this.Hide();
        }

        private void label4_Click(object sender, EventArgs e)
        {
            frmRentar formRentar = new frmRentar(this.usuarioLogueado);
            formRentar.Show();
            this.Hide();
        }

        private void label5_Click(object sender, EventArgs e)
        {
            Servicios formServicios = new Servicios(this.usuarioLogueado);
            formServicios.Show();
            this.Hide();
        }

        private void label6_Click(object sender, EventArgs e)
        {
            Conocenos formConocenos = new Conocenos(this.usuarioLogueado);
            formConocenos.Show();
            this.Hide();
        }

        // Ir al perfil (Click en el nombre)
        private void labelnombreuser_Click(object sender, EventArgs e)
        {
            if (this.usuarioLogueado != null)
            {
                Favoritos formFavoritos = new Favoritos(this.usuarioLogueado);
                formFavoritos.Show();
                this.Hide();
            }
        }

        // --- BOTÓN NARANJA (PUBLICAR) ---
        private void button1_Click(object sender, EventArgs e)
        {
            if (this.usuarioLogueado == null)
            {
                MessageBox.Show("Debes iniciar sesión para publicar.");
                return;
            }

            frmPublicar formPublicar = new frmPublicar(this, this.usuarioLogueado);
            formPublicar.Show();
            this.Hide();
        }

        // --- BUSCADOR DEL MENÚ ---
        private void btnBuscarMenu_Click(object sender, EventArgs e)
        {
            string operacion = comboBox2.SelectedItem?.ToString() ?? "Venta";
            string tipo = comboBox3.SelectedItem?.ToString() ?? "";

            if (operacion == "Renta" || operacion == "Rentar")
            {
                frmRentar rentar = new frmRentar(this.usuarioLogueado);
                rentar.Show();
                rentar.RecibirFiltrosExternos(tipo);
            }
            else
            {
                frmComprar comprar = new frmComprar(this.usuarioLogueado);
                comprar.Show();
                comprar.RecibirFiltrosExternos(tipo);
            }
            this.Hide();
        }

        // --- IMÁGENES DE CATEGORÍAS (ATAJOS) ---
        private void pictureBoxcasas6_Click(object sender, EventArgs e) { IrAComprarConFiltro("Casa"); }
        private void pictureBox7depa_Click(object sender, EventArgs e) { IrAComprarConFiltro("Departamento"); }
        private void pictureBox8_Click(object sender, EventArgs e) { IrAComprarConFiltro("Terreno"); }

        private void IrAComprarConFiltro(string tipo)
        {
            frmComprar comprar = new frmComprar(this.usuarioLogueado);
            comprar.Show();
            comprar.RecibirFiltrosExternos(tipo);
            this.Hide();
        }

        // --- CONTROL DE SESIÓN Y AVATAR ---

        // Mostrar/Ocultar el panel flotante del usuario
        private void picAvatar_Click(object sender, EventArgs e)
        {
            if (panel2 == null) return;

            // Truco visual para posicionar el panel justo debajo del avatar
            panel2.Parent = this;
            Point s = picAvatar.PointToScreen(Point.Empty);
            Point f = this.PointToClient(s);
            panel2.Left = f.X - panel2.Width + picAvatar.Width;
            panel2.Top = f.Y + picAvatar.Height;

            panel2.Visible = !panel2.Visible;
            panel2.BringToFront();
        }

        private void labelcerrarsesion_Click(object sender, EventArgs e)
        {
            frmMenuPrincipal nuevo = new frmMenuPrincipal(); // Reiniciar app limpia
            nuevo.Show();
            this.Close();
        }

        private void btnlogin_Click(object sender, EventArgs e)
        {
            frmLogin formLogin = new frmLogin();
            formLogin.Show();
            this.Hide();
        }

        // =========================================================
        //                 REDES SOCIALES (NUEVO CÓDIGO)
        // =========================================================

        // Función auxiliar "Blindada" para abrir enlaces en cualquier Windows moderno
        private void AbrirEnlace(string url)
        {
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true // Esto fuerza a Windows a usar el navegador por defecto
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show("No se pudo abrir el enlace.\nDetalle: " + ex.Message);
            }
        }

        // TIKTOK
        private void pictureBoxTikTok_Click(object sender, EventArgs e)
        {
            AbrirEnlace("https://www.tiktok.com/@inmoviral");
        }

        // INSTAGRAM
        private void pictureBoxInstagram_Click(object sender, EventArgs e)
        {
            AbrirEnlace("https://www.instagram.com/inmoviralbis/");
        }
    }
}