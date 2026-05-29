using System;
using System.Drawing;
using System.Windows.Forms;
using System.Data;

namespace Inmoviral3._0
{
    public partial class frmRentar : Form
    {
        private Usuarios usuarioLogueado;
        string phBuscar = "Buscar por calle o colonia";
        private bool cargando = true;

        public frmRentar() { InitializeComponent(); ConfigurarInicio(); }
        public frmRentar(Usuarios usuario) { InitializeComponent(); this.usuarioLogueado = usuario; ConfigurarInicio(); }

        private void ConfigurarInicio()
        {
            if (panel2 != null) panel2.Visible = false;
            if (btnlogin != null) btnlogin.Visible = true;
            if (picAvatar != null) picAvatar.Visible = false;
        }

        private void frmRentar_Load(object sender, EventArgs e)
        {
            cargando = true;
            InicializarFiltros();
            ConfigurarPlaceholders();

            if (this.usuarioLogueado != null)
            {
                if (btnlogin != null) btnlogin.Visible = false;
                if (picAvatar != null) picAvatar.Visible = true;
                if (labelnombreuser != null) labelnombreuser.Text = "Hola, " + usuarioLogueado.Usuario;
            }
            else
            {
                if (btnlogin != null) btnlogin.Visible = true;
                if (picAvatar != null) picAvatar.Visible = false;
                if (panel2 != null) panel2.Visible = false;
            }
            CargarTarjetas();
            cargando = false;
        }

        public void RecibirFiltrosExternos(string tipoInmueble)
        {
            if (!string.IsNullOrEmpty(tipoInmueble) && comboBoxInmueble != null)
            {
                if (comboBoxInmueble.Items.Contains(tipoInmueble))
                    comboBoxInmueble.SelectedItem = tipoInmueble;
            }
            CargarTarjetas();
        }

        private void comboboxComprar_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (cargando) return;
            if (comboboxComprar.SelectedItem == null) return;
            string seleccion = comboboxComprar.SelectedItem.ToString();

            if (seleccion == "Comprar")
            {
                this.BeginInvoke(new Action(() => {
                    frmComprar formComprar = new frmComprar(this.usuarioLogueado);
                    formComprar.Show();
                    this.Close();
                }));
            }
        }

        // --- CARGAR TARJETAS CON ADMIN ---
        private void CargarTarjetas()
        {
            if (flowPanelRedondeado1 == null) return;
            flowPanelRedondeado1.Controls.Clear();

            string textoBusqueda = txtFiltroCalleColonia != null ? txtFiltroCalleColonia.Text : "";
            string valOperacion = comboboxComprar.SelectedItem?.ToString() ?? "";
            string valInmueble = comboBoxInmueble.SelectedItem?.ToString() ?? "";
            string valPrecio = comboBoxPrecio.SelectedItem?.ToString() ?? "";
            string valCuartos = comboBoxCuartos.SelectedItem?.ToString() ?? "";

            Modelo modelo = new Modelo();
            System.Data.DataTable tablaCasas = modelo.FiltrarPublicaciones(textoBusqueda, valOperacion, valInmueble, valPrecio, valCuartos);

            // VERIFICAR SI ES ADMIN
            bool esAdmin = (this.usuarioLogueado != null && this.usuarioLogueado.Usuario == "admin");

            foreach (DataRow fila in tablaCasas.Rows)
            {
                TarjetaPropiedad tarjeta = new TarjetaPropiedad();
                int id = (fila["ID_Publicacion"] != DBNull.Value) ? Convert.ToInt32(fila["ID_Publicacion"]) : 0;
                string titulo = (fila["Titulo"] != DBNull.Value) ? fila["Titulo"].ToString() : "";

                decimal precio = 0;
                if (fila["Precio"] != DBNull.Value) decimal.TryParse(fila["Precio"].ToString(), out precio);

                string imagen = (fila["Imagen"] != DBNull.Value) ? fila["Imagen"].ToString() : "";
                string colonia = (fila["Colonia"] != DBNull.Value) ? fila["Colonia"].ToString() : "";
                string muni = (fila["Municipio"] != DBNull.Value) ? fila["Municipio"].ToString() : "";
                string recs = fila.Table.Columns.Contains("Recamaras") ? fila["Recamaras"].ToString() : "0";
                string banos = fila.Table.Columns.Contains("Banos") ? fila["Banos"].ToString() : "0";
                string terreno = fila.Table.Columns.Contains("M2_Terreno") ? fila["M2_Terreno"].ToString() : "0";
                string detalles = $"{recs} rec. | {banos} Baños | {terreno}m²";

                tarjeta.CargarDatos(id, titulo, precio, detalles, $"{colonia}, {muni}", imagen, this.usuarioLogueado);
                tarjeta.Margin = new Padding(15);

                // --- MODO ADMIN: Botón Eliminar ---
                if (esAdmin)
                {
                    tarjeta.MostrarBotonEliminar(true);
                    tarjeta.lblEliminar.Click += (s, ev) =>
                    {
                        DialogResult r = MessageBox.Show("¿Eres Admin. Eliminar esta publicación?", "ADMINISTRADOR", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
                        if (r == DialogResult.Yes)
                        {
                            modelo.EliminarPublicacion(id);
                            CargarTarjetas();
                        }
                    };
                }
                // ----------------------------------

                tarjeta.Click += (s, e) => {
                    frmPublicacion ver = new frmPublicacion(id, this.usuarioLogueado);
                    ver.Show();
                    this.Close();
                };

                // --- CORRECCIÓN AQUÍ: System.Windows.Forms.Control ---
                foreach (System.Windows.Forms.Control c in tarjeta.Controls)
                {
                    if (c.Name != "btnFavorito" && c.Name != "btnFavoritoRojo" && c.Name != "btnEliminar")
                    {
                        c.Click += (s, e) => {
                            frmPublicacion ver = new frmPublicacion(id, this.usuarioLogueado);
                            ver.Show();
                            this.Close();
                        };
                    }
                }

                flowPanelRedondeado1.Controls.Add(tarjeta);
            }
        }

        // --- NAVEGACIÓN ---
        private void pictureBox1_Click(object sender, EventArgs e) { frmMenuPrincipal menu = new frmMenuPrincipal(this.usuarioLogueado); menu.Show(); this.Close(); }
        private void button1_Click(object sender, EventArgs e) { if (this.usuarioLogueado == null) { MessageBox.Show("Debes iniciar sesión."); return; } frmMenuPrincipal menuOwner = new frmMenuPrincipal(this.usuarioLogueado); frmPublicar publicar = new frmPublicar(menuOwner, this.usuarioLogueado); publicar.Show(); this.Close(); }
        private void label1_Click(object sender, EventArgs e) { frmComprar comprar = new frmComprar(this.usuarioLogueado); comprar.Show(); this.Close(); }
        private void picAvatar_Click(object sender, EventArgs e) { if (panel2 == null) return; panel2.Parent = this; Point s = picAvatar.PointToScreen(Point.Empty); Point f = this.PointToClient(s); panel2.Left = f.X - panel2.Width + picAvatar.Width; panel2.Top = f.Y + picAvatar.Height; panel2.Visible = !panel2.Visible; panel2.BringToFront(); }
        private void labelcerrarsesion_Click(object sender, EventArgs e) { frmMenuPrincipal menu = new frmMenuPrincipal(); menu.Show(); this.Close(); }
        private void btnlogin_Click(object sender, EventArgs e) { frmLogin login = new frmLogin(); login.Origen = "Rentar"; login.Show(); this.Close(); }
        private void pictureBoxBuscarFiltro_Click(object sender, EventArgs e) { CargarTarjetas(); }
        private void txtFiltroCalleColonia_KeyDown(object sender, KeyEventArgs e) { if (e.KeyCode == Keys.Enter) { e.SuppressKeyPress = true; CargarTarjetas(); } }
        private void Filtros_SelectedIndexChanged(object sender, EventArgs e) { }

        private void InicializarFiltros()
        {
            if (comboboxComprar != null) { comboboxComprar.Items.Clear(); comboboxComprar.Items.Add("Comprar"); comboboxComprar.Items.Add("Rentar"); comboboxComprar.SelectedIndex = 1; }
            if (comboBoxInmueble != null) { comboBoxInmueble.Items.Clear(); comboBoxInmueble.Items.Add("Inmueble"); comboBoxInmueble.Items.Add("Casa"); comboBoxInmueble.Items.Add("Departamento"); comboBoxInmueble.Items.Add("Terreno"); comboBoxInmueble.SelectedIndex = 0; }
            if (comboBoxPrecio != null) { comboBoxPrecio.Items.Clear(); comboBoxPrecio.Items.Add("Precio"); comboBoxPrecio.Items.Add("$500,000 - $1,000,000"); comboBoxPrecio.Items.Add("$1,000,000 - $2,000,000"); comboBoxPrecio.Items.Add("$2,000,000 - $5,000,000"); comboBoxPrecio.Items.Add("$5,000,000 - $10,000,000"); comboBoxPrecio.Items.Add("$10,000,000 - $20,000,000"); comboBoxPrecio.Items.Add("$20,000,000 - $50,000,000"); comboBoxPrecio.Items.Add("$50,000,000+"); comboBoxPrecio.SelectedIndex = 0; }
            if (comboBoxCuartos != null) { comboBoxCuartos.Items.Clear(); comboBoxCuartos.Items.Add("Cuartos"); comboBoxCuartos.Items.Add("0"); comboBoxCuartos.Items.Add("1"); comboBoxCuartos.Items.Add("2"); comboBoxCuartos.Items.Add("3"); comboBoxCuartos.Items.Add("4"); comboBoxCuartos.Items.Add("5+"); comboBoxCuartos.SelectedIndex = 0; }
        }
        private void ConfigurarPlaceholders() { if (txtFiltroCalleColonia != null) { txtFiltroCalleColonia.Text = phBuscar; txtFiltroCalleColonia.ForeColor = Color.Gray; txtFiltroCalleColonia.Enter += (s, e) => { if (txtFiltroCalleColonia.Text == phBuscar) { txtFiltroCalleColonia.Text = ""; txtFiltroCalleColonia.ForeColor = Color.Black; } }; txtFiltroCalleColonia.Leave += (s, e) => { if (string.IsNullOrWhiteSpace(txtFiltroCalleColonia.Text)) { txtFiltroCalleColonia.Text = phBuscar; txtFiltroCalleColonia.ForeColor = Color.Gray; } }; } if (pnlMasFiltros != null) { pnlMasFiltros.Controls.Clear(); Label lbl = new Label(); lbl.Text = "Más Filtros"; lbl.ForeColor = Color.White; lbl.BackColor = Color.Transparent; lbl.AutoSize = false; lbl.TextAlign = ContentAlignment.MiddleCenter; lbl.Dock = DockStyle.Fill; lbl.Cursor = Cursors.Hand; lbl.Click += (s, e) => { MessageBox.Show("Filtros avanzados..."); }; pnlMasFiltros.Controls.Add(lbl); } }
        private void pnlMasFiltros_Click(object sender, EventArgs e) { MessageBox.Show("Filtros avanzados..."); }
        protected override void OnFormClosed(FormClosedEventArgs e) { base.OnFormClosed(e); }
        private void labelservicios_Click(object sender, EventArgs e) { Servicios f = new Servicios(this.usuarioLogueado); f.Show(); this.Close(); }
        private void label6_Click(object sender, EventArgs e) { Conocenos f = new Conocenos(this.usuarioLogueado); f.Show(); this.Close(); }
    }
}