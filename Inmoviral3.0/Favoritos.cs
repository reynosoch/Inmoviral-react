using System;
using System.Drawing;
using System.Windows.Forms;
using System.Data;

namespace Inmoviral3._0
{
    public partial class Favoritos : Form
    {
        private Usuarios usuarioLogueado;

        public Favoritos(Usuarios usuario)
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

        private void Favoritos_Load(object sender, EventArgs e)
        {
            if (usuarioLogueado == null)
            {
                MessageBox.Show("Debes iniciar sesión.");
                this.Close();
                return;
            }

            // Configuración Visual
            if (btnlogin != null) btnlogin.Visible = false;
            if (picAvatar != null) picAvatar.Visible = true;
            if (labelnombreuser != null) labelnombreuser.Text = "Hola, " + usuarioLogueado.Usuario;

            // CARGAR AMBOS PANELES
            CargarMisPublicaciones();
            CargarFavoritos();
        }

        // --- MÉTODO 1: MIS PUBLICACIONES (Panel Superior) ---
        private void CargarMisPublicaciones()
        {
            if (flowPanelContenedor == null) return;
            flowPanelContenedor.Controls.Clear();

            try
            {
                Modelo modelo = new Modelo();
                // Llamamos al método SQL blindado
                DataTable datos = modelo.ObtenerMisPublicaciones(usuarioLogueado.Id);

                // Usamos la misma función de llenado
                LlenarPanel(flowPanelContenedor, datos, "No has publicado ninguna propiedad.");
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error cargando tus publicaciones: " + ex.Message);
            }
        }

        // --- MÉTODO 2: FAVORITOS (Panel Inferior - Ya funcionaba) ---
        private void CargarFavoritos()
        {
            if (flowPanelRedondeado1 == null) return;
            flowPanelRedondeado1.Controls.Clear();

            try
            {
                Modelo modelo = new Modelo();
                DataTable datos = modelo.ObtenerFavoritos(usuarioLogueado.Id);

                // Usamos la misma función de llenado
                LlenarPanel(flowPanelRedondeado1, datos, "Aún no tienes favoritos guardados.");
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error cargando favoritos: " + ex.Message);
            }
        }

        // --- GENERADOR DE TARJETAS (BLINDADO) ---
        // En Favoritos.cs

        private void LlenarPanel(FlowLayoutPanel panel, DataTable datos, string mensajeVacio)
        {
            panel.Controls.Clear();

            if (datos == null || datos.Rows.Count == 0)
            {
                Label lblVacio = new Label();
                lblVacio.Text = mensajeVacio;
                lblVacio.AutoSize = true;
                lblVacio.Font = new Font("Segoe UI", 14, FontStyle.Regular);
                lblVacio.ForeColor = Color.DimGray;
                lblVacio.Margin = new Padding(50);
                panel.Controls.Add(lblVacio);
                return;
            }

            foreach (DataRow fila in datos.Rows)
            {
                TarjetaPropiedad tarjeta = new TarjetaPropiedad();

                // 1. Lectura segura de datos
                int id = (fila["ID_Publicacion"] != DBNull.Value) ? Convert.ToInt32(fila["ID_Publicacion"]) : 0;
                string titulo = (fila["Titulo"] != DBNull.Value) ? fila["Titulo"].ToString() : "Sin Título";

                decimal precio = 0;
                if (fila["Precio"] != DBNull.Value) decimal.TryParse(fila["Precio"].ToString(), out precio);

                string imagen = (fila.Table.Columns.Contains("Imagen") && fila["Imagen"] != DBNull.Value) ? fila["Imagen"].ToString() : "";
                string colonia = (fila["Colonia"] != DBNull.Value) ? fila["Colonia"].ToString() : "";
                string muni = (fila["Municipio"] != DBNull.Value) ? fila["Municipio"].ToString() : "";

                string recs = fila.Table.Columns.Contains("Recamaras") && fila["Recamaras"] != DBNull.Value ? fila["Recamaras"].ToString() : "0";
                string banos = fila.Table.Columns.Contains("Banos") && fila["Banos"] != DBNull.Value ? fila["Banos"].ToString() : "0";
                string terreno = fila.Table.Columns.Contains("M2_Terreno") && fila["M2_Terreno"] != DBNull.Value ? fila["M2_Terreno"].ToString() : "0";
                string detalles = $"{recs} rec. | {banos} Baños | {terreno}m²";

                // 2. Cargar en tarjeta
                tarjeta.CargarDatos(id, titulo, precio, detalles, $"{colonia}, {muni}", imagen, this.usuarioLogueado);
                tarjeta.Margin = new Padding(20);

                // 3. Eventos Click (Ver Detalle)
                // --- CORRECCIÓN: Aseguramos que sea el Control de Windows ---
                foreach (System.Windows.Forms.Control c in tarjeta.Controls)
                {
                    // Excluimos los corazones Y EL BOTÓN DE ELIMINAR
                    if (c.Name != "btnFavorito" && c.Name != "btnFavoritoRojo" && c.Name != "btnEliminar")
                    {
                        // Solo si no es ninguno de esos botones, el clic abre el detalle
                        c.Click += (s, ev) => { AbrirDetalle(id); };
                    }
                }

                // --- 4. LÓGICA DE ELIMINAR (SOLO PARA MIS PUBLICACIONES) ---
                // Si el panel actual es 'flowPanelContenedor', significa que estamos en "Mis Publicaciones"
                if (panel == flowPanelContenedor)
                {
                    tarjeta.MostrarBotonEliminar(true);

                    // Conectamos el clic del botón rojo
                    tarjeta.lblEliminar.Click += (s, ev) =>
                    {
                        DialogResult result = MessageBox.Show("¿Seguro que quieres eliminar esta publicación permanentemente?", "Eliminar", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);

                        if (result == DialogResult.Yes)
                        {
                            try
                            {
                                // A. Borrar de la BD
                                Modelo modelo = new Modelo();
                                modelo.EliminarPublicacion(id);

                                // B. Mensaje de éxito
                                MessageBox.Show("Publicación eliminada.");

                                // C. Recargar la lista para que desaparezca visualmente
                                CargarMisPublicaciones();
                            }
                            catch (Exception ex)
                            {
                                MessageBox.Show("No se pudo eliminar: " + ex.Message);
                            }
                        }
                    };
                }

                panel.Controls.Add(tarjeta);
            }
        }

        private void AbrirDetalle(int id)
        {
            frmPublicacion ver = new frmPublicacion(id, this.usuarioLogueado);
            ver.Show();
            this.Close();
        }

        // --- NAVEGACIÓN Y UI ---
        private void pictureBox1_Click(object sender, EventArgs e)
        {
            frmMenuPrincipal menu = new frmMenuPrincipal(this.usuarioLogueado);
            menu.Show(); this.Close();
        }
        private void label1_Click(object sender, EventArgs e) { frmComprar f = new frmComprar(this.usuarioLogueado); f.Show(); this.Close(); }
        private void label4_Click(object sender, EventArgs e) { frmRentar f = new frmRentar(this.usuarioLogueado); f.Show(); this.Close(); }
        private void label6_Click(object sender, EventArgs e) { Conocenos f = new Conocenos(this.usuarioLogueado); f.Show(); this.Close(); }
        private void labelservicios_Click(object sender, EventArgs e) { Servicios f = new Servicios(this.usuarioLogueado); f.Show(); this.Close(); }

        private void button1_Click(object sender, EventArgs e)
        {
            frmMenuPrincipal menu = new frmMenuPrincipal(this.usuarioLogueado);
            frmPublicar pub = new frmPublicar(menu, this.usuarioLogueado);
            pub.Show(); this.Close();
        }

        private void picAvatar_Click(object sender, EventArgs e) { if (panel5 != null) { panel5.Visible = !panel5.Visible; panel5.BringToFront(); } }
        private void labelcerrarsesion_Click(object sender, EventArgs e) { frmMenuPrincipal menu = new frmMenuPrincipal(); menu.Show(); this.Close(); }
        private void btnlogin_Click(object sender, EventArgs e) { frmLogin login = new frmLogin(); login.Show(); this.Close(); }

        // Eventos vacíos (para que no marque error si están conectados)
        private void lblTabFavoritos_Click(object sender, EventArgs e) { }
        private void lblTabMisPublicaciones_Click(object sender, EventArgs e) { }
        protected override void OnFormClosed(FormClosedEventArgs e) { base.OnFormClosed(e); }
    }
}