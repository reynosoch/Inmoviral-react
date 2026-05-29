using System;
using System.Threading.Tasks; // NECESARIO PARA EL "AWAIT"
using System.Windows.Forms;

namespace Inmoviral3._0
{
    public partial class frmSplash : Form
    {
        // Esta variable evita que el menú se abra dos veces
        // (por ejemplo, si el tiempo acaba justo cuando das clic)
        private bool introTerminada = false;

        public frmSplash()
        {
            InitializeComponent();

            // Configuración visual
            this.FormBorderStyle = FormBorderStyle.None;
            this.WindowState = FormWindowState.Maximized;
            this.BackColor = System.Drawing.Color.Black;
        }

        // --- AQUÍ ESTÁ LA MAGIA (ASYNC) ---
        // Usamos 'async' para poder esperar sin congelar la pantalla
        private async void frmSplash_Load(object sender, EventArgs e)
        {
            // Esperamos 3000 milisegundos (3 segundos)
            // Mientras tanto, el GIF se mueve fluido
            await Task.Delay(3800);

            // Al terminar la espera, intentamos saltar
            SaltarIntro();
        }

        private void SaltarIntro()
        {
            // Si ya saltamos (por clic o por tiempo), no hacemos nada
            if (introTerminada) return;

            introTerminada = true; // Marcamos que ya terminamos

            // Abrir menú
            frmMenuPrincipal menu = new frmMenuPrincipal();
            menu.Show();

            // Ocultar Splash
            this.Hide();
        }

        // --- EVENTOS MANUALES ---
        // Asegúrate que tu PictureBox tenga el evento Click conectado a este método
        private void pbxGif_Click(object sender, EventArgs e)
        {
            SaltarIntro();
        }

        protected override bool ProcessCmdKey(ref Message msg, Keys keyData)
        {
            if (keyData == Keys.Escape)
            {
                SaltarIntro();
                return true;
            }
            return base.ProcessCmdKey(ref msg, keyData);
        }
    }
}