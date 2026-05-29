using System;
using System.Drawing;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    public partial class ventayrenta : Form
    {
        // Variables miembro
        private frmPublicar publicarOwner; // El formulario anterior (frmPublicar)
        private Usuarios usuarioLogueado;
        private string tipoPropiedadSeleccionado; // Ej: "Casa"

        // --- CONSTRUCTOR (3 ARGUMENTOS) ---
        public ventayrenta(frmPublicar ownerForm, Usuarios usuarioActual, string tipoPropiedad)
        {
            InitializeComponent();

            // 1. Guarda los datos recibidos
            this.publicarOwner = ownerForm;
            this.usuarioLogueado = usuarioActual;
            this.tipoPropiedadSeleccionado = tipoPropiedad;

            // 2. Muestra el nombre de usuario
            if (usuarioLogueado != null && labelnombreuser != null)
            {
                labelnombreuser.Text = "Hola, " + usuarioLogueado.Usuario;
            }

            // 3. Oculta el panel del avatar al cargar
            if (panel2 != null)
            {
                panel2.Visible = false;
            }
        }

        // --- MÉTODO PARA NAVEGAR (AVANZAR) ---
        private void NavegarSiguiente(string operacionSeleccionada) // Ej: "Venta"
        {
            try
            {
                // Llama al constructor de 4 argumentos de propiedadinfo1
                propiedadinfo1 formInfo = new propiedadinfo1(
                    this,                         // El formulario 'ventayrenta' actual
                    this.usuarioLogueado,         // El objeto usuario
                    this.tipoPropiedadSeleccionado, // "Casa", "Terreno", etc.
                    operacionSeleccionada         // "Venta" o "Renta"
                );

                formInfo.Show();
                this.Hide();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error al abrir 'propiedadinfo1': " + ex.Message, "Error de Constructor");
            }
        }

        // --- Eventos de Botón (Venta/Renta) ---
        // ¡DEBES CONECTAR ESTOS EN EL DISEÑADOR!
        private void btnventa_Click(object sender, EventArgs e)
        {
            NavegarSiguiente("Venta");
        }

        private void btnrenta_Click(object sender, EventArgs e)
        {
            NavegarSiguiente("Renta");
        }


        // --- BOTONES DE NAVEGACIÓN Y PERFIL ---

        // Botón de "atrás" (Flecha)
        // ¡DEBES CONECTAR ESTE EN EL DISEÑADOR!
        private void pictureBox1_Click(object sender, EventArgs e)
        {
            if (publicarOwner != null)
            {
                publicarOwner.Show(); // <-- MUESTRA FRMPUBLICAR
            }
            this.Close();
        }

        // Botón de "atrás" (Label '<')
        // ¡DEBES CONECTAR ESTE EN EL DISEÑADOR!
        private void label10_Click(object sender, EventArgs e)
        {
            if (publicarOwner != null)
            {
                publicarOwner.Show(); // <-- MUESTRA FRMPUBLICAR
            }
            this.Close();
        }

        // Click en el avatar (para mostrar/ocultar panel2)
        private void picAvatar_Click(object sender, EventArgs e)
        {
            Point screenPoint = picAvatar.PointToScreen(Point.Empty);
            Point formPoint = this.PointToClient(screenPoint);

            panel2.Left = formPoint.X - panel2.Width + picAvatar.Width;
            panel2.Top = formPoint.Y + picAvatar.Height;
            panel2.Visible = !panel2.Visible; // Muestra/Oculta el panel
            panel2.BringToFront();
        }

        // Cerrar sesión
        private void labelcerrarsesion_Click(object sender, EventArgs e)
        {
            frmMenuPrincipal menuPrincipalNuevo = new frmMenuPrincipal();
            menuPrincipalNuevo.Show();
            this.Close();
        }

        private void ventayrenta_Load(object sender, EventArgs e)
        {
            // (Vacío)
        }
    }
}