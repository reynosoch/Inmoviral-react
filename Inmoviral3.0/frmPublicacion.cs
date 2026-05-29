using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using System.IO;
using System.Linq;
using System.Globalization;
using Microsoft.Web.WebView2.Core;
using System.Text.Json;

namespace Inmoviral3._0
{
    public partial class frmPublicacion : Form
    {
        // --- Variables Miembro ---
        private int publicacionId;
        private PublicacionCompleta publicacion;
        private Modelo modelo = new Modelo();
        private Usuarios usuarioLogueado;
        private bool modoEdicionFotos = false;
        private List<string> nuevasImagenesParaGuardar = new List<string>();
        private (string Lat, string Lon)? ubicacionPendiente;
        private bool modoEdicionGeneral = false;
        private bool programmaticallyChangingCheck = false;

        public frmPublicacion(int idPublicacion, Usuarios usuario)
        {
            InitializeComponent();
            this.publicacionId = idPublicacion;
            this.usuarioLogueado = usuario;

            // Configuración segura de eventos
            if (pictureBox4 != null) { pictureBox4.Visible = false; pictureBox4.Click += pictureBox4_Click; }
            if (btnActualizarFoto != null) btnActualizarFoto.Click += btnActualizarFoto_Click;
            if (btnActualizarDescripcion != null) btnActualizarDescripcion.Click += btnActualizarDescripcion_Click;
            if (btnActualizarAmenidades != null) btnActualizarAmenidades.Click += btnActualizarAmenidades_Click;
            if (btnActualizarCaracteristicas != null) btnActualizarCaracteristicas.Click += btnActualizarCaracteristicas_Click;
            if (picboxDeshacer != null) picboxDeshacer.Click += pictureBox9_Click;
            if (btnActualizar != null) btnActualizar.Click += btnActualizarUbicacion_Click;
            if (pictureboxEditarGeneral != null) pictureboxEditarGeneral.Click += pictureboxEditarGeneral_Click;
            if (label11 != null) label11.Click += label11_Click;

            // Checkboxes Exclusivos
            if (checkBoxCasa != null) checkBoxCasa.CheckedChanged += ChkTipo_CheckedChanged;
            if (checkBoxDepa != null) checkBoxDepa.CheckedChanged += ChkTipo_CheckedChanged;
            if (checkBoxTerreno != null) checkBoxTerreno.CheckedChanged += ChkTipo_CheckedChanged;
            if (checkBoxVenta != null) checkBoxVenta.CheckedChanged += ChkOperacion_CheckedChanged;
            if (checkBoxRenta != null) checkBoxRenta.CheckedChanged += ChkOperacion_CheckedChanged;
        }

        // --- NAVEGACIÓN DEL ENCABEZADO (LO QUE PEDISTE) ---

        // 1. PictureBox1 -> Ir al Menú Principal
        private void pictureBox1_Click(object sender, EventArgs e)
        {
            frmMenuPrincipal menu = new frmMenuPrincipal(this.usuarioLogueado);
            menu.Show();
            this.Close();
        }

        // 2. Label1 -> Ir a Comprar
        private void label1_Click(object sender, EventArgs e)
        {
            frmComprar comprar = new frmComprar(this.usuarioLogueado);
            comprar.Show();
            this.Close();
        }

        // 3. Label4 -> Ir a Rentar
        private void label4_Click(object sender, EventArgs e)
        {
            frmRentar rentar = new frmRentar(this.usuarioLogueado);
            rentar.Show();
            this.Close();
        }

        // 4. Label5 -> Ir a Servicios
        private void label5_Click(object sender, EventArgs e)
        {
            Servicios servicios = new Servicios(this.usuarioLogueado);
            servicios.Show();
            this.Close();
        }

        // 5. Label6 -> Ir a Conócenos (Asumo que Label6 es Conócenos por el diseño estándar)
        private void label6_Click(object sender, EventArgs e)
        {
            Conocenos conocenos = new Conocenos(this.usuarioLogueado);
            conocenos.Show();
            this.Close();
        }

        // 6. Button1 -> Ir a Publicar (Reiniciar publicación)
        private void button1_Click(object sender, EventArgs e)
        {
            if (this.usuarioLogueado == null)
            {
                MessageBox.Show("Debes iniciar sesión para publicar.");
                return;
            }
            // Creamos un menú temporal como owner
            frmMenuPrincipal menuOwner = new frmMenuPrincipal(this.usuarioLogueado);
            frmPublicar publicar = new frmPublicar(menuOwner, this.usuarioLogueado);
            publicar.Show();
            this.Close();
        }


        // --- EVENTOS EXCLUSIVIDAD ---
        private void ChkTipo_CheckedChanged(object sender, EventArgs e)
        {
            if (programmaticallyChangingCheck) return;
            CheckBox chk = (CheckBox)sender;
            if (chk.Checked)
            {
                programmaticallyChangingCheck = true;
                if (chk != checkBoxCasa && checkBoxCasa != null) checkBoxCasa.Checked = false;
                if (chk != checkBoxDepa && checkBoxDepa != null) checkBoxDepa.Checked = false;
                if (chk != checkBoxTerreno && checkBoxTerreno != null) checkBoxTerreno.Checked = false;
                programmaticallyChangingCheck = false;
            }
        }

        private void ChkOperacion_CheckedChanged(object sender, EventArgs e)
        {
            if (programmaticallyChangingCheck) return;
            CheckBox chk = (CheckBox)sender;
            if (chk.Checked)
            {
                programmaticallyChangingCheck = true;
                if (chk != checkBoxVenta && checkBoxVenta != null) checkBoxVenta.Checked = false;
                if (chk != checkBoxRenta && checkBoxRenta != null) checkBoxRenta.Checked = false;
                programmaticallyChangingCheck = false;
            }
        }

        // --- EVENTO LOAD ---
        private void frmPublicacion_Load_1(object sender, EventArgs e)
        {
            if (this.usuarioLogueado != null)
            {
                if (btnlogin != null) btnlogin.Visible = false;
                if (picAvatar != null) picAvatar.Visible = true;
                if (panel2 != null) panel2.Visible = false;
                if (labelnombreuser != null) labelnombreuser.Text = "Hola, " + this.usuarioLogueado.Usuario;
            }
            else
            {
                if (btnlogin != null) btnlogin.Visible = true;
                if (picAvatar != null) picAvatar.Visible = false;
                if (panel2 != null) panel2.Visible = false;
            }

            OcultarBotonesEdicion();
            OcultarCamposEdicionDescripcion(true);
            OcultarCamposEdicionCaracteristicas(true);

            try
            {
                this.publicacion = modelo.GetPublicacionCompletaPorID(this.publicacionId);

                if (this.publicacion == null || string.IsNullOrEmpty(this.publicacion.Titulo))
                {
                    MessageBox.Show("No se pudo encontrar la publicación.", "Error");
                    this.Close();
                    return;
                }

                nuevasImagenesParaGuardar = new List<string>(publicacion.Imagenes);

                CargarImagenes();
                CargarDatosPrincipales();
                CargarAmenidades();
                CargarCaracteristicas();
                CargarMapa();
                SetControlsReadOnly(true);
                ActualizarEstadoCompraRenta();

                // VALIDACIÓN DE PERMISOS
                bool mostrarEdicion = false;
                if (this.usuarioLogueado != null)
                {
                    bool esAdminSupremo = (this.usuarioLogueado.Usuario == "admin");
                    bool esElDueño = (this.publicacion.Id_Usuario == this.usuarioLogueado.Id);
                    if (esAdminSupremo || esElDueño) mostrarEdicion = true;
                }

                if (panel10 != null)
                {
                    panel10.Visible = mostrarEdicion;
                    if (mostrarEdicion) panel10.BringToFront();
                }
                if (pictureboxEditarGeneral != null)
                {
                    pictureboxEditarGeneral.Visible = mostrarEdicion;
                    if (mostrarEdicion) pictureboxEditarGeneral.BringToFront();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error al cargar: " + ex.Message);
                this.Close();
            }
        }

        private void OcultarBotonesEdicion()
        {
            if (btnActualizarDescripcion != null) btnActualizarDescripcion.Visible = false;
            if (btnActualizarAmenidades != null) btnActualizarAmenidades.Visible = false;
            if (btnActualizarCaracteristicas != null) btnActualizarCaracteristicas.Visible = false;
            if (btnActualizar != null) btnActualizar.Visible = false;
            if (btnActualizarFoto != null) btnActualizarFoto.Visible = false;
            if (picboxDeshacer != null) picboxDeshacer.Visible = false;
            if (panel10 != null) panel10.Visible = false;
            if (pictureboxEditarGeneral != null) pictureboxEditarGeneral.Visible = false;
        }

        // --- MÉTODOS VISUALES ---

        private void OcultarCamposEdicionDescripcion(bool ocultar)
        {
            if (txtTitulo != null) txtTitulo.Visible = !ocultar;
            if (txtPrecio != null) txtPrecio.Visible = !ocultar;
            if (txtColonia != null) txtColonia.Visible = !ocultar;
            if (txtEstado != null) txtEstado.Visible = !ocultar;
            if (label19 != null) label19.Visible = ocultar;
            if (txtDescripcion != null) txtDescripcion.Visible = !ocultar;

            if (lblTitulo != null) lblTitulo.Visible = ocultar;
            if (lblPrecio != null) lblPrecio.Visible = ocultar;
            if (lblColonia != null) lblColonia.Visible = ocultar;
            if (lblEstado != null) lblEstado.Visible = ocultar;
        }

        private void OcultarCamposEdicionCaracteristicas(bool ocultar)
        {
            // TextBoxes
            if (txtTerreno != null) txtTerreno.Visible = !ocultar;
            if (txtConstruccion != null) txtConstruccion.Visible = !ocultar;
            if (txtRecamara != null) txtRecamara.Visible = !ocultar;
            if (txtBanos != null) txtBanos.Visible = !ocultar;
            if (txtParking != null) txtParking.Visible = !ocultar;
            if (txtAntiguedad != null) txtAntiguedad.Visible = !ocultar;

            // Labels
            if (lblTerreno != null) lblTerreno.Visible = ocultar;
            if (lblConstruccion != null) lblConstruccion.Visible = ocultar;
            if (lblRecamaras != null) lblRecamaras.Visible = ocultar;
            if (lblBanos != null) lblBanos.Visible = ocultar;
            if (lblParking != null) lblParking.Visible = ocultar;
            if (lblAntiguedad != null) lblAntiguedad.Visible = ocultar;

            // CheckBoxes (Visibilidad)
            if (checkBoxCasa != null) checkBoxCasa.Visible = !ocultar;
            if (checkBoxDepa != null) checkBoxDepa.Visible = !ocultar;
            if (checkBoxTerreno != null) checkBoxTerreno.Visible = !ocultar;
            if (checkBoxVenta != null) checkBoxVenta.Visible = !ocultar;
            if (checkBoxRenta != null) checkBoxRenta.Visible = !ocultar;

            if (lblTipoInmueble != null) lblTipoInmueble.Visible = ocultar;
            if (lblVentaoRenta != null) lblVentaoRenta.Visible = ocultar;
        }

        private void CargarDatosPrincipales()
        {
            if (publicacion == null) return;
            if (lblTitulo != null) lblTitulo.Text = publicacion.Titulo;
            if (lblPrecio != null) lblPrecio.Text = publicacion.Precio.ToString("C", CultureInfo.GetCultureInfo("es-MX"));
            if (lblColonia != null) lblColonia.Text = publicacion.Colonia;
            if (lblEstado != null) lblEstado.Text = publicacion.Municipio;
            if (label19 != null) label19.Text = publicacion.Descripcion;

            if (txtDescripcion != null) { txtDescripcion.Text = publicacion.Descripcion; txtDescripcion.ReadOnly = true; }
            if (txtTitulo != null) txtTitulo.Text = publicacion.Titulo;
            if (txtPrecio != null) txtPrecio.Text = publicacion.Precio.ToString(CultureInfo.InvariantCulture);
            if (txtColonia != null) txtColonia.Text = publicacion.Colonia;
            if (txtEstado != null) txtEstado.Text = publicacion.Municipio;
        }

        private void CargarImagenes()
        {
            if (flpThumbnails == null) return;
            flpThumbnails.Controls.Clear();
            if (pictureBox4 != null) { flpThumbnails.Controls.Add(pictureBox4); pictureBox4.Visible = modoEdicionFotos; }
            foreach (string rutaImagen in nuevasImagenesParaGuardar) CrearThumbnail(rutaImagen);
        }

        private void CrearThumbnail(string rutaImagen)
        {
            try
            {
                Panel pnlThumbnail = new Panel { Size = new Size(200, 200), Margin = new Padding(10), Tag = rutaImagen };
                PictureBox pic = new PictureBox { Dock = DockStyle.Fill, SizeMode = PictureBoxSizeMode.Zoom };
                if (File.Exists(rutaImagen))
                {
                    byte[] bytes = File.ReadAllBytes(rutaImagen);
                    using (MemoryStream ms = new MemoryStream(bytes)) pic.Image = Image.FromStream(ms);
                }
                else pic.BackColor = Color.LightGray;
                pnlThumbnail.Controls.Add(pic);

                if (modoEdicionFotos)
                {
                    Label lblRemove = new Label();
                    lblRemove.Text = "X"; lblRemove.Font = new Font("Arial", 10, FontStyle.Bold);
                    lblRemove.ForeColor = Color.White; lblRemove.BackColor = Color.Red; lblRemove.Size = new Size(20, 20);
                    lblRemove.Location = new Point(pnlThumbnail.Width - lblRemove.Width - 2, 2);
                    lblRemove.Cursor = Cursors.Hand; lblRemove.Tag = rutaImagen;
                    lblRemove.Click += new EventHandler(lblRemove_Click);
                    pnlThumbnail.Controls.Add(lblRemove); lblRemove.BringToFront();
                }
                flpThumbnails.Controls.Add(pnlThumbnail);
                flpThumbnails.Controls.SetChildIndex(pnlThumbnail, flpThumbnails.Controls.Count - 2);
            }
            catch { }
        }

        private void CargarAmenidades()
        {
            if (panel5 == null) return;

            foreach (CheckBox chk in panel5.Controls.OfType<CheckBox>())
            {
                chk.Checked = false;
                chk.AutoCheck = false;
                chk.Enabled = true;
            }

            if (publicacion.Amenidades == null) return;

            if (checkBoxAmueblado != null) checkBoxAmueblado.Checked = publicacion.Amenidades.Contains("Amueblado");
            if (checkBoxMascotas != null) checkBoxMascotas.Checked = publicacion.Amenidades.Contains("Admite mascotas");
            if (checkBoxFracPrivado != null) checkBoxFracPrivado.Checked = publicacion.Amenidades.Contains("Fracc privado");
            if (checkBoxAC != null) checkBoxAC.Checked = publicacion.Amenidades.Contains("Aire acondicionado");
            if (checkBoxCalefaccion != null) checkBoxCalefaccion.Checked = publicacion.Amenidades.Contains("Calefacción");
            if (checkBoxCamaraSeguridad != null) checkBoxCamaraSeguridad.Checked = publicacion.Amenidades.Contains("Cámara de seguridad");
            if (checkBoxCuartoLavado != null) checkBoxCuartoLavado.Checked = publicacion.Amenidades.Contains("Cuarto de lavado");
            if (checkBoxGYM != null) checkBoxGYM.Checked = publicacion.Amenidades.Contains("Gimnasio");
            if (checkBoxVigilancia != null) checkBoxVigilancia.Checked = publicacion.Amenidades.Contains("Vigilancia 24h");
            if (checkBoxAsador != null) checkBoxAsador.Checked = publicacion.Amenidades.Contains("Area de asador");
            if (checkBoxTinaco != null) checkBoxTinaco.Checked = publicacion.Amenidades.Contains("Tinaco");
            if (checkBoxChimenea != null) checkBoxChimenea.Checked = publicacion.Amenidades.Contains("Chimenea");
            if (checkBoxPatioJuegos != null) checkBoxPatioJuegos.Checked = publicacion.Amenidades.Contains("Patio de juegos");
            if (checkBoxElvador != null) checkBoxElvador.Checked = publicacion.Amenidades.Contains("Elevador");
            if (checkBoxPortonElectrico != null) checkBoxPortonElectrico.Checked = publicacion.Amenidades.Contains("Portón eléctrico");
            if (checkBoxMantenimiento != null) checkBoxMantenimiento.Checked = publicacion.Amenidades.Contains("Mantenimiento incluido");
            if (checkBoxEsquina != null) checkBoxEsquina.Checked = publicacion.Amenidades.Contains("Ubicación en esquina");
        }

        private void CargarCaracteristicas()
        {
            if (lblTerreno != null) lblTerreno.Text = $"{publicacion.M2_Terreno} m²";
            if (lblConstruccion != null) lblConstruccion.Text = $"{publicacion.M2_Construccion} m²";
            if (lblRecamaras != null) lblRecamaras.Text = publicacion.Recamaras.ToString();
            if (lblBanos != null) lblBanos.Text = publicacion.Banos.ToString();
            if (lblParking != null) lblParking.Text = publicacion.Estacionamiento.ToString();
            if (lblTipoInmueble != null) lblTipoInmueble.Text = publicacion.TipoPropiedad;
            if (lblAntiguedad != null) lblAntiguedad.Text = publicacion.Antiguedad;
            if (lblVentaoRenta != null) lblVentaoRenta.Text = publicacion.Operacion;
            if (lblUsuario != null) lblUsuario.Text = publicacion.UsuarioAgente;

            if (txtTerreno != null) txtTerreno.Text = publicacion.M2_Terreno.ToString(CultureInfo.InvariantCulture);
            if (txtConstruccion != null) txtConstruccion.Text = publicacion.M2_Construccion.ToString(CultureInfo.InvariantCulture);
            if (txtRecamara != null) txtRecamara.Text = publicacion.Recamaras.ToString(CultureInfo.InvariantCulture);
            if (txtBanos != null) txtBanos.Text = publicacion.Banos.ToString(CultureInfo.InvariantCulture);
            if (txtParking != null) txtParking.Text = publicacion.Estacionamiento.ToString(CultureInfo.InvariantCulture);
            if (txtAntiguedad != null) txtAntiguedad.Text = publicacion.Antiguedad;

            programmaticallyChangingCheck = true;
            if (checkBoxCasa != null) { checkBoxCasa.Checked = publicacion.TipoPropiedad?.Equals("Casa", StringComparison.OrdinalIgnoreCase) == true; checkBoxCasa.AutoCheck = false; }
            if (checkBoxDepa != null) { checkBoxDepa.Checked = publicacion.TipoPropiedad?.Equals("Departamento", StringComparison.OrdinalIgnoreCase) == true; checkBoxDepa.AutoCheck = false; }
            if (checkBoxTerreno != null) { checkBoxTerreno.Checked = publicacion.TipoPropiedad?.Equals("Terreno", StringComparison.OrdinalIgnoreCase) == true; checkBoxTerreno.AutoCheck = false; }

            if (checkBoxVenta != null) { checkBoxVenta.Checked = publicacion.Operacion?.Equals("Venta", StringComparison.OrdinalIgnoreCase) == true; checkBoxVenta.AutoCheck = false; }
            if (checkBoxRenta != null) { checkBoxRenta.Checked = publicacion.Operacion?.Equals("Renta", StringComparison.OrdinalIgnoreCase) == true; checkBoxRenta.AutoCheck = false; }
            programmaticallyChangingCheck = false;

            HabilitarEdicionCaracteristicas(false);
        }

        private void ActualizarEstadoCompraRenta()
        {
            if (label1 == null || label4 == null || panel8 == null || panel9 == null || lblVentaoRenta == null) return;
            Font regularFont = new Font(label1.Font, FontStyle.Regular);
            Font boldFont = new Font(label1.Font, FontStyle.Bold);
            label1.Font = regularFont; label4.Font = regularFont;
            panel8.Visible = false; panel9.Visible = false;

            if (lblVentaoRenta.Text.Equals("Venta", StringComparison.OrdinalIgnoreCase))
            {
                label1.Font = boldFont; panel8.Visible = true;
            }
            else if (lblVentaoRenta.Text.Equals("Renta", StringComparison.OrdinalIgnoreCase))
            {
                label4.Font = boldFont; panel9.Visible = true;
            }
        }

        private void SetControlsReadOnly(bool lectura)
        {
            if (txtDescripcion != null) txtDescripcion.ReadOnly = lectura;
            if (panel5 != null)
            {
                foreach (CheckBox chk in panel5.Controls.OfType<CheckBox>())
                {
                    chk.AutoCheck = !lectura;
                    chk.Enabled = true;
                }
            }
        }

        // --- EVENTOS ---

        private void label11_Click(object sender, EventArgs e)
        {
            string operacion = publicacion?.Operacion ?? "";
            bool esVenta = operacion.Equals("Venta", StringComparison.OrdinalIgnoreCase);
            if (esVenta) { frmComprar nuevo = new frmComprar(this.usuarioLogueado); nuevo.Show(); }
            else { frmRentar nuevo = new frmRentar(this.usuarioLogueado); nuevo.Show(); }
            this.Close();
        }

        private void HabilitarEdicionCaracteristicas(bool habilitar)
        {
            // TextBoxes
            if (txtTerreno != null) txtTerreno.Enabled = habilitar;
            if (txtConstruccion != null) txtConstruccion.Enabled = habilitar;
            if (txtRecamara != null) txtRecamara.Enabled = habilitar;
            if (txtBanos != null) txtBanos.Enabled = habilitar;
            if (txtParking != null) txtParking.Enabled = habilitar;
            if (txtAntiguedad != null) txtAntiguedad.Enabled = habilitar;

            // CheckBoxes (Usamos AutoCheck para bloquear/desbloquear interacción)
            if (checkBoxCasa != null) { checkBoxCasa.AutoCheck = habilitar; checkBoxCasa.Enabled = true; }
            if (checkBoxDepa != null) { checkBoxDepa.AutoCheck = habilitar; checkBoxDepa.Enabled = true; }
            if (checkBoxTerreno != null) { checkBoxTerreno.AutoCheck = habilitar; checkBoxTerreno.Enabled = true; }

            if (checkBoxVenta != null) { checkBoxVenta.AutoCheck = habilitar; checkBoxVenta.Enabled = true; }
            if (checkBoxRenta != null) { checkBoxRenta.AutoCheck = habilitar; checkBoxRenta.Enabled = true; }
        }

        private void pictureboxEditarGeneral_Click(object sender, EventArgs e)
        {
            modoEdicionGeneral = !modoEdicionGeneral;

            if (btnActualizarFoto != null) btnActualizarFoto.Visible = modoEdicionGeneral;
            modoEdicionFotos = modoEdicionGeneral;
            CargarImagenes();

            if (btnActualizarDescripcion != null) btnActualizarDescripcion.Visible = modoEdicionGeneral;
            if (txtDescripcion != null) txtDescripcion.ReadOnly = !modoEdicionGeneral;
            OcultarCamposEdicionDescripcion(!modoEdicionGeneral);

            if (btnActualizarCaracteristicas != null) btnActualizarCaracteristicas.Visible = modoEdicionGeneral;
            HabilitarEdicionCaracteristicas(modoEdicionGeneral);
            OcultarCamposEdicionCaracteristicas(!modoEdicionGeneral);

            if (btnActualizarAmenidades != null) btnActualizarAmenidades.Visible = modoEdicionGeneral;
            if (panel5 != null)
            {
                foreach (CheckBox chk in panel5.Controls.OfType<CheckBox>())
                {
                    chk.AutoCheck = modoEdicionGeneral;
                    chk.Enabled = true;
                }
            }

            if (btnActualizar != null) btnActualizar.Visible = modoEdicionGeneral;
            if (picboxDeshacer != null) picboxDeshacer.Visible = modoEdicionGeneral;
        }

        private void pictureBox4_Click(object sender, EventArgs e)
        {
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Multiselect = true;
                ofd.Filter = "Archivos de imagen|*.jpg;*.jpeg;*.png;*.gif";
                if (ofd.ShowDialog() == DialogResult.OK)
                {
                    foreach (string fileName in ofd.FileNames)
                    {
                        if (!nuevasImagenesParaGuardar.Contains(fileName))
                        {
                            nuevasImagenesParaGuardar.Add(fileName);
                            CrearThumbnail(fileName);
                        }
                    }
                }
            }
        }

        private void lblRemove_Click(object sender, EventArgs e)
        {
            Label lbl = sender as Label;
            if (lbl != null)
            {
                string ruta = lbl.Tag as string;
                Panel pnl = lbl.Parent as Panel;
                if (ruta != null && pnl != null)
                {
                    nuevasImagenesParaGuardar.Remove(ruta);
                    flpThumbnails.Controls.Remove(pnl);
                    pnl.Dispose();
                }
            }
        }

        // --- GUARDAR CAMBIOS ---
        private void ConstruirPublicacionDesdeUI()
        {
            publicacion.Imagenes = new List<string>(nuevasImagenesParaGuardar);
            if (txtTitulo != null) publicacion.Titulo = string.IsNullOrWhiteSpace(txtTitulo.Text) ? publicacion.Titulo : txtTitulo.Text;

            if (txtPrecio != null)
            {
                string precioTexto = !string.IsNullOrWhiteSpace(txtPrecio.Text) ? txtPrecio.Text : lblPrecio.Text;
                precioTexto = precioTexto.Replace("$", "").Replace(",", "");
                if (decimal.TryParse(precioTexto, NumberStyles.Currency | NumberStyles.Number, CultureInfo.InvariantCulture, out decimal precioVal))
                    publicacion.Precio = precioVal;
            }

            if (txtDescripcion != null) publicacion.Descripcion = txtDescripcion.Text;
            if (txtColonia != null) publicacion.Colonia = string.IsNullOrWhiteSpace(txtColonia.Text) ? publicacion.Colonia : txtColonia.Text;
            if (txtEstado != null) publicacion.Municipio = string.IsNullOrWhiteSpace(txtEstado.Text) ? publicacion.Municipio : txtEstado.Text;

            if (panel5 != null)
            {
                var amenidades = panel5.Controls.OfType<CheckBox>().Where(cb => cb.Checked).Select(cb => cb.Text).ToList();
                publicacion.Amenidades = amenidades;
            }

            if (txtTerreno != null && txtTerreno.Visible)
            {
                if (decimal.TryParse(txtTerreno.Text, NumberStyles.Number, CultureInfo.InvariantCulture, out var m2Terr)) publicacion.M2_Terreno = m2Terr;
                if (decimal.TryParse(txtConstruccion.Text, NumberStyles.Number, CultureInfo.InvariantCulture, out var m2Const)) publicacion.M2_Construccion = m2Const;
                if (int.TryParse(txtRecamara.Text, out var recs)) publicacion.Recamaras = recs;
                if (int.TryParse(txtBanos.Text, out var banos)) publicacion.Banos = banos;
                if (int.TryParse(txtParking.Text, out var park)) publicacion.Estacionamiento = park;
                if (txtAntiguedad != null) publicacion.Antiguedad = string.IsNullOrWhiteSpace(txtAntiguedad.Text) ? publicacion.Antiguedad : txtAntiguedad.Text;

                if (checkBoxCasa.Checked) publicacion.TipoPropiedad = "Casa";
                else if (checkBoxDepa.Checked) publicacion.TipoPropiedad = "Departamento";
                else if (checkBoxTerreno.Checked) publicacion.TipoPropiedad = "Terreno";

                if (checkBoxVenta.Checked) publicacion.Operacion = "Venta";
                else if (checkBoxRenta.Checked) publicacion.Operacion = "Renta";
            }

            if (ubicacionPendiente.HasValue)
            {
                publicacion.Latitud = ubicacionPendiente.Value.Lat;
                publicacion.Longitud = ubicacionPendiente.Value.Lon;
            }
        }

        private void ActualizarDatosGenerico()
        {
            try
            {
                ConstruirPublicacionDesdeUI();
                modelo.ActualizarPublicacionCompleta(publicacion);
                MessageBox.Show("Actualizado correctamente.");
                frmPublicacion_Load_1(null, null);
            }
            catch (Exception ex) { MessageBox.Show(ex.Message); }
        }

        private void btnActualizarFoto_Click(object sender, EventArgs e) { ActualizarDatosGenerico(); }
        private void btnActualizarDescripcion_Click(object sender, EventArgs e) { ActualizarDatosGenerico(); }
        private void btnActualizarAmenidades_Click(object sender, EventArgs e) { ActualizarDatosGenerico(); }
        private void btnActualizarCaracteristicas_Click(object sender, EventArgs e) { ActualizarDatosGenerico(); }
        private void btnActualizarUbicacion_Click(object sender, EventArgs e) { ActualizarDatosGenerico(); }

        private void pictureBox9_Click(object sender, EventArgs e)
        {
            ubicacionPendiente = null;
            if (btnActualizar != null) btnActualizar.Visible = false;
            if (picboxDeshacer != null) picboxDeshacer.Visible = false;

            if (webView21 != null && webView21.CoreWebView2 != null)
            {
                string lat = (publicacion.Latitud ?? "0").Replace(",", ".");
                string lon = (publicacion.Longitud ?? "0").Replace(",", ".");
                string jsonMessage = $"{{\"type\":\"setMapCenter\", \"latitude\":{lat}, \"longitude\":{lon}, \"addMarker\":true, \"zoom\":16}}";
                webView21.CoreWebView2.PostWebMessageAsJson(jsonMessage);
            }
        }

        private async void CargarMapa()
        {
            try
            {
                if (webView21 == null) return;
                await webView21.EnsureCoreWebView2Async(null);
                webView21.CoreWebView2.NavigationCompleted += CoreWebView2_NavigationCompleted;
                webView21.CoreWebView2.WebMessageReceived += CoreWebView2_WebMessageReceived;
                string htmlPath = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "mapa.html");
                webView21.CoreWebView2.Navigate(new Uri(htmlPath).AbsoluteUri);
            }
            catch { }
        }

        private void CoreWebView2_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            if (e.IsSuccess && publicacion != null)
            {
                string lat = (publicacion.Latitud ?? "0").Replace(",", ".");
                string lon = (publicacion.Longitud ?? "0").Replace(",", ".");
                string jsonMessage = $"{{\"type\":\"setMapCenter\", \"latitude\":{lat}, \"longitude\":{lon}, \"addMarker\":true, \"zoom\":16}}";
                webView21.CoreWebView2.PostWebMessageAsJson(jsonMessage);
            }
        }

        private void CoreWebView2_WebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(e.WebMessageAsJson)) return;
                using var doc = JsonDocument.Parse(e.WebMessageAsJson);
                var root = doc.RootElement;
                if (!root.TryGetProperty("type", out var typeEl)) return;
                var type = typeEl.GetString();

                if (type == "locationPicked" || type == "mapClicked")
                {
                    if (!modoEdicionGeneral)
                    {
                        this.Invoke((MethodInvoker)delegate {
                            MessageBox.Show("Debe activar el modo de edición para cambiar la ubicación.");
                        });
                        return;
                    }
                    var lat = root.GetProperty("latitude").GetDouble().ToString(CultureInfo.InvariantCulture);
                    var lon = root.GetProperty("longitude").GetDouble().ToString(CultureInfo.InvariantCulture);
                    ubicacionPendiente = (lat, lon);

                    this.Invoke((MethodInvoker)delegate {
                        if (btnActualizar != null) btnActualizar.Visible = true;
                        if (picboxDeshacer != null) picboxDeshacer.Visible = true;
                    });
                }
            }
            catch { }
        }

        private void txtPrecio_TextChanged(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtPrecio.Text)) return;
            try
            {
                txtPrecio.TextChanged -= txtPrecio_TextChanged;
                string textoLimpio = txtPrecio.Text.Replace("$", "").Replace(",", "").Replace(" ", "").Trim();
                if (long.TryParse(textoLimpio, out long valor))
                {
                    txtPrecio.Text = valor.ToString("N0", CultureInfo.CreateSpecificCulture("es-MX"));
                    txtPrecio.SelectionStart = txtPrecio.Text.Length;
                }
            }
            catch { }
            finally { txtPrecio.TextChanged += txtPrecio_TextChanged; }
        }

        private void txtPrecio_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (!char.IsControl(e.KeyChar) && !char.IsDigit(e.KeyChar)) e.Handled = true;
        }

        // --- MENÚ LATERAL ---
        private void picAvatar_Click(object sender, EventArgs e)
        {
            if (panel2 == null) return;
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
            // Cerrar sesión localmente
            this.usuarioLogueado = null;
            if (panel2 != null) panel2.Visible = false;
            if (btnlogin != null) btnlogin.Visible = true;
            if (picAvatar != null) picAvatar.Visible = false;
            if (labelnombreuser != null) labelnombreuser.Text = "";

            // Quitar modo edición
            modoEdicionGeneral = false;
            OcultarBotonesEdicion();
            OcultarCamposEdicionDescripcion(true);
            OcultarCamposEdicionCaracteristicas(true);

            MessageBox.Show("Has cerrado sesión.");
        }

        private void btnlogin_Click(object sender, EventArgs e)
        {
            frmLogin login = new frmLogin();
            login.Origen = "Publicacion";
            login.IdParaRedireccion = this.publicacionId;
            login.Show();
            this.Close();
        }
    }
}