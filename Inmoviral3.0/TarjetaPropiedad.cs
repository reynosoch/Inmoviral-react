using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;
using System.IO;

namespace Inmoviral3._0
{
    public partial class TarjetaPropiedad : UserControl
    {
        public int IdPublicacion { get; set; }
        public Usuarios UsuarioActual { get; set; }

        // Nuevo control público para el botón de eliminar
        public Label lblEliminar;

        public TarjetaPropiedad()
        {
            InitializeComponent();
            this.DoubleBuffered = true;

            // --- 1. CREAR EL BOTÓN ROJO DE ELIMINAR ---
            lblEliminar = new Label();
            lblEliminar.Name = "btnEliminar"; // Nombre interno
            lblEliminar.Text = "-";
            lblEliminar.ForeColor = Color.White;
            lblEliminar.BackColor = Color.Red;
            lblEliminar.Font = new Font("Arial", 16, FontStyle.Bold);
            lblEliminar.TextAlign = ContentAlignment.MiddleCenter;
            lblEliminar.Size = new Size(30, 30); // Tamaño del círculo
            lblEliminar.Cursor = Cursors.Hand;
            lblEliminar.Visible = false; // Oculto por defecto (tú decides cuándo mostrarlo)

            // Hacerlo redondo
            GraphicsPath path = new GraphicsPath();
            path.AddEllipse(0, 0, 30, 30);
            lblEliminar.Region = new Region(path);

            // --- 2. POSICIONARLO EN LA IMAGEN (0,0) ---
            if (picCasa != null)
            {
                lblEliminar.Parent = picCasa; // Para que sea transparente sobre la foto
                lblEliminar.Location = new Point(5, 5); // Un pequeño margen (se ve mejor que 0,0 absoluto)
                lblEliminar.BringToFront();
            }
            else
            {
                this.Controls.Add(lblEliminar);
                lblEliminar.Location = new Point(5, 5);
                lblEliminar.BringToFront();
            }

            // Configuración de corazones existentes
            ConfigurarCorazon(btnFavorito);
            ConfigurarCorazon(btnFavoritoRojo);
        }

        // Método para mostrar u ocultar el botón rojo desde fuera
        public void MostrarBotonEliminar(bool mostrar)
        {
            lblEliminar.Visible = mostrar;
        }

        private void ConfigurarCorazon(PictureBox btn)
        {
            if (btn != null && picCasa != null)
            {
                btn.Parent = picCasa;
                btn.BackColor = Color.Transparent;
                btn.Location = new Point(picCasa.Width - 75, 10);
                btn.BringToFront();
            }
        }

        public void CargarDatos(int id, string titulo, decimal precio, string detalles, string ubicacion, string rutaImagen, Usuarios usuario)
        {
            this.IdPublicacion = id;
            this.UsuarioActual = usuario;

            lblTitulo.Text = titulo;
            lblPrecio.Text = precio.ToString("C0");
            lblDetalles.Text = detalles;
            lblUbicacion.Text = ubicacion;

            if (File.Exists(rutaImagen))
            {
                try
                {
                    using (FileStream fs = new FileStream(rutaImagen, FileMode.Open, FileAccess.Read))
                    {
                        picCasa.Image = Image.FromStream(fs);
                    }
                }
                catch { picCasa.BackColor = Color.Gray; }
            }

            if (this.UsuarioActual != null)
            {
                Modelo modelo = new Modelo();
                bool esFav = modelo.EsFavorito(this.UsuarioActual.Id, this.IdPublicacion);
                btnFavoritoRojo.Visible = esFav;
                btnFavorito.Visible = !esFav;
            }
            else
            {
                btnFavoritoRojo.Visible = false;
                btnFavorito.Visible = true;
            }
        }

        private void btnFavorito_Click(object sender, EventArgs e)
        {
            if (ValidarUsuario())
            {
                try
                {
                    Modelo modelo = new Modelo();
                    modelo.ToggleFavorito(this.UsuarioActual.Id, this.IdPublicacion, true);
                    btnFavorito.Visible = false;
                    btnFavoritoRojo.Visible = true;
                }
                catch (Exception ex) { MessageBox.Show("Error al guardar: " + ex.Message); }
            }
        }

        private void btnFavoritoRojo_Click(object sender, EventArgs e)
        {
            if (ValidarUsuario())
            {
                try
                {
                    Modelo modelo = new Modelo();
                    modelo.ToggleFavorito(this.UsuarioActual.Id, this.IdPublicacion, false);
                    btnFavoritoRojo.Visible = false;
                    btnFavorito.Visible = true;
                }
                catch (Exception ex) { MessageBox.Show("Error al eliminar: " + ex.Message); }
            }
        }

        private bool ValidarUsuario()
        {
            if (this.UsuarioActual == null)
            {
                MessageBox.Show("Debes iniciar sesión.");
                return false;
            }
            return true;
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            Graphics graph = e.Graphics;
            graph.SmoothingMode = SmoothingMode.AntiAlias;
            using (GraphicsPath path = new GraphicsPath())
            using (Pen pen = new Pen(Color.Black, 1))
            {
                Rectangle rect = this.ClientRectangle;
                rect.Width--; rect.Height--;
                int r = 20;
                path.AddArc(rect.X, rect.Y, r, r, 180, 90);
                path.AddArc(rect.Right - r, rect.Y, r, r, 270, 90);
                path.AddArc(rect.Right - r, rect.Bottom - r, r, r, 0, 90);
                path.AddArc(rect.X, rect.Bottom - r, r, r, 90, 90);
                path.CloseFigure();
                this.Region = new Region(path);
                e.Graphics.DrawPath(pen, path);
            }
        }
    }
}