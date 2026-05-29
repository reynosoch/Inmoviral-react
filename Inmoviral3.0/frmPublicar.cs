using System;
using System.Drawing;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    public partial class frmPublicar : Form
    {
        private frmMenuPrincipal menuPrincipalOwner; // Referencia al menú que nos llamó
        private Usuarios usuarioLogueado;

        public frmPublicar(frmMenuPrincipal owner, Usuarios usuario)
        {
            InitializeComponent();
            this.menuPrincipalOwner = owner;
            this.usuarioLogueado = usuario;

            if (usuarioLogueado != null && labelnombreuser != null)
            {
                labelnombreuser.Text = "Hola, " + usuarioLogueado.Usuario;
            }

            // Aseguramos que el panel de avatar inicie oculto
            if (panel2 != null) panel2.Visible = false;
        }

        // --- NAVEGACIÓN: VOLVER AL MENÚ (Flecha Atrás) ---
        private void pictureBox1_Click(object sender, EventArgs e)
        {
            VolverAlMenu();
        }

        // También para label10 si es otro botón de atrás
        private void label10_Click(object sender, EventArgs e)
        {
            VolverAlMenu();
        }

        // Método auxiliar para no repetir código
        private void VolverAlMenu()
        {
            // Opción A: Si guardamos la referencia del owner, lo usamos
            if (menuPrincipalOwner != null)
            {
                menuPrincipalOwner.Show();
                menuPrincipalOwner.BringToFront();
            }
            // Opción B: Búsqueda de emergencia por si owner es null
            else
            {
                foreach (Form form in Application.OpenForms)
                {
                    if (form is frmMenuPrincipal)
                    {
                        form.Show();
                        break;
                    }
                }
            }

            this.Close(); // Cerramos Publicar
        }

        // --- NAVEGACIÓN HACIA ADELANTE (Selección de Casa/Terreno/Depa) ---
        private void AbrirVentaRenta(string tipoSeleccionado)
        {
            if (usuarioLogueado == null)
            {
                MessageBox.Show("Error: No se ha detectado un usuario.", "Error");
                return;
            }

            // Creamos el siguiente paso
            ventayrenta formVentaRenta = new ventayrenta(this, this.usuarioLogueado, tipoSeleccionado);
            formVentaRenta.Show();
            this.Hide(); // Ocultamos Publicar (no lo cerramos para poder volver si cancelan)
        }

        private void btncasa_Click(object sender, EventArgs e) { AbrirVentaRenta("Casa"); }
        private void btnterreno_Click(object sender, EventArgs e) { AbrirVentaRenta("Terreno"); }
        private void btndepa_Click_1(object sender, EventArgs e) { AbrirVentaRenta("Departamento"); }

        // --- AVATAR Y CIERRE DE SESIÓN ---
        private void picAvatar_Click(object sender, EventArgs e)
        {
            if (panel2 == null) return;

            // Truco para que el panel flote sobre todo
            panel2.Parent = this;

            Point screenPoint = picAvatar.PointToScreen(Point.Empty);
            Point formPoint = this.PointToClient(screenPoint);

            panel2.Left = formPoint.X - panel2.Width + picAvatar.Width;
            panel2.Top = formPoint.Y + picAvatar.Height;
            panel2.Visible = !panel2.Visible;
            panel2.BringToFront();
        }

        private void labelcerrarsesion_Click(object sender, EventArgs e)
        {
            // Al cerrar sesión, queremos un menú LIMPIO (nuevo)
            frmMenuPrincipal menuNuevo = new frmMenuPrincipal(); // Sin usuario
            menuNuevo.Show();

            // Cerramos este formulario
            this.Close();

            // Opcional: Si el menú viejo estaba oculto, lo buscamos y cerramos para liberar memoria
            if (menuPrincipalOwner != null) menuPrincipalOwner.Close();
        }

        // Evento de seguridad: Si cierran con la "X" de la ventana
        protected override void OnFormClosed(FormClosedEventArgs e)
        {
            base.OnFormClosed(e);
            // Si no estamos yendo a otra pantalla de la app (como ventayrenta)
            // y el usuario simplemente cerró, aseguramos que la App no se quede colgada
            if (Application.OpenForms.Count == 0) Application.Exit();
        }

        // Métodos vacíos o no usados
        private void btnlogin_Click(object sender, EventArgs e) { /* Lógica si fuera necesaria */ }
        private void frmPublicar_Load(object sender, EventArgs e) { }
    }
}