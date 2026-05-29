// --- REEMPLAZA TODO EN propiedadinfo4.cs CON ESTO ---

using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    public partial class propiedadinfo4 : Form
    {
        // --- 1. Variables Miembro (para guardar TODO) ---
        private propiedadinfo3 ownerForm;
        private Usuarios usuarioLogueado;

        // Datos de Info 1
        private string tipoPropiedad;
        private string tipoOperacion;
        private string municipio;
        private string calleyNumero;
        private string numExterior;
        private string colonia;
        private string cp;
        private string coordenadas;

        // Datos de Info 2
        private string titulo;
        private string descripcion;
        private string precio;
        private string antiguedad;
        private List<string> listaRutasImagenes;

        // Datos de Info 3
        private string m2Construccion;
        private string m2Terreno;
        private string recamaras;
        private string banos;
        private string mediosBanos;
        private string estacionamiento;

        // Colores para el "toggle"
        Color colorEncendido = Color.FromArgb(255, 230, 204); // Naranja claro (ajusta a tu gusto)
        Color colorApagado = Color.WhiteSmoke; // Blanco/Gris claro

        // --- 2. Constructor ---
        public propiedadinfo4(
            propiedadinfo3 owner,
            Usuarios usuario,
            // Info 1
            string tipoProp,
            string tipoOp,
            string municipio,
            string calleyNumero,
            string numExterior,
            string colonia,
            string cp,
            string coordenadas,
            // Info 2
            string titulo,
            string descripcion,
            string precio,
            string antiguedad,
            List<string> listaRutas,
            // Info 3
            string m2Construccion,
            string m2Terreno,
            string recamaras,
            string banos,
            string mediosBanos,
            string estacionamiento
            )
        {
            InitializeComponent();

            // --- 3. Guarda todos los datos ---
            this.ownerForm = owner;
            this.usuarioLogueado = usuario;
            this.tipoPropiedad = tipoProp;
            this.tipoOperacion = tipoOp;
            this.municipio = municipio;
            this.calleyNumero = calleyNumero;
            this.numExterior = numExterior;
            this.colonia = colonia;
            this.cp = cp;
            this.coordenadas = coordenadas;
            this.titulo = titulo;
            this.descripcion = descripcion;
            this.precio = precio;
            this.antiguedad = antiguedad;
            this.listaRutasImagenes = listaRutas;
            this.m2Construccion = m2Construccion;
            this.m2Terreno = m2Terreno;
            this.recamaras = recamaras;
            this.banos = banos;
            this.mediosBanos = mediosBanos;
            this.estacionamiento = estacionamiento;

            if (this.usuarioLogueado != null && labelnombreuser != null)
            {
                labelnombreuser.Text = "Hola, " + this.usuarioLogueado.Usuario;
            }
        }

        // --- 4. Lógica del Formulario ---

        // Evento Load (tu designer lo nombró 'propiedadinfo4_Load_1')
        private void propiedadinfo4_Load_1(object sender, EventArgs e)
        {
            if (panel2 != null)
                panel2.Visible = false;

            this.ActiveControl = label2; // Asigna foco al título

            // --- Inicializa el estado "apagado" de todas tus amenidades ---
            InicializarAmenidad(pnlAmueblado);
            InicializarAmenidad(pnlMascotas);
            InicializarAmenidad(pnlAlberca);
            InicializarAmenidad(pnlPatioJuegos);
            InicializarAmenidad(pnlBalcon);
            InicializarAmenidad(pnlCamaraSeguridad);
            InicializarAmenidad(pnlCuartoLavado);
            InicializarAmenidad(pnlGYM);
            InicializarAmenidad(pnlVigilancia);
            InicializarAmenidad(pnlFracPriv);
            InicializarAmenidad(pnlCuartoServicio);
            InicializarAmenidad(pnlAsador);
            InicializarAmenidad(pnlTinaco);
            InicializarAmenidad(pnlChimenea);
            InicializarAmenidad(pnlAC);
            InicializarAmenidad(pnlCalefaccion);
            InicializarAmenidad(pnlElevador);
            InicializarAmenidad(pnlPortonElectrico);
            InicializarAmenidad(pnlMantIncluido);
            InicializarAmenidad(pnlUbiEsquina);

            // Actualiza la barra de progreso al paso final
            int totalSteps = 4;
            int currentStep = 4;
            if (pnlProgressTrack.Width > 0)
            {
                pnlProgressFill.Width = (pnlProgressTrack.Width / totalSteps) * currentStep;
            }
        }

        // Método auxiliar para poner un panel en "apagado"
        private void InicializarAmenidad(Panel pnl)
        {
            if (pnl == null) return; // Comprobación de seguridad
            pnl.Tag = "apagado";
            pnl.BackColor = colorApagado;
            if (pnl.Controls.Count > 0)
            {
                pnl.Controls[0].BackColor = Color.Transparent;
            }
        }


        // --- 5. Lógica de "Toggle" para Amenidades ---
        private void Amenidad_Click(object sender, EventArgs e)
        {
            Panel panelObjetivo = null;

            if (sender is Panel)
            {
                panelObjetivo = sender as Panel;
            }
            else if (sender is PictureBox)
            {
                PictureBox picHijo = sender as PictureBox;
                if (picHijo != null && picHijo.Parent is Panel)
                {
                    panelObjetivo = picHijo.Parent as Panel;
                }
            }

            if (panelObjetivo == null)
            {
                return;
            }

            if (panelObjetivo.Tag.ToString() == "apagado")
            {
                // ENCENDER
                panelObjetivo.Tag = "encendido";
                panelObjetivo.BackColor = colorEncendido;
                if (panelObjetivo.Controls.Count > 0)
                {
                    panelObjetivo.Controls[0].BackColor = colorEncendido;
                }
            }
            else
            {
                // APAGAR
                panelObjetivo.Tag = "apagado";
                panelObjetivo.BackColor = colorApagado;
                if (panelObjetivo.Controls.Count > 0)
                {
                    panelObjetivo.Controls[0].BackColor = Color.Transparent;
                }
            }
        }

        // --- 6. Lógica de Navegación ---

        // Botón de "Atrás" (tu 'label13')
        // (¡Corregido! Eliminado el duplicado)
        private void label13_Click(object sender, EventArgs e)
        {
            if (this.ownerForm != null)
            {
                this.ownerForm.Show(); // Muestra propiedadinfo3 de nuevo
            }
            this.Close();
        }

        // Botón "Continuar" (tu 'btnContinuar' que actúa como "Publicar")
        // (¡Corregido! Eliminado el duplicado y renombrado)
        private void btnContinuar_Click(object sender, EventArgs e)
        {
                // 1. Recolectar las amenidades seleccionadas
            List<string> amenidadesSeleccionadas = new List<string>();
            if (pnlAmueblado.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Amueblado");
            if (pnlMascotas.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Admite mascotas");
            if (pnlAlberca.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Alberca");
            if (pnlPatioJuegos.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Patio de juegos");
            if (pnlBalcon.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Balcón");
            if (pnlCamaraSeguridad.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Cámara seguridad");
            if (pnlCuartoLavado.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Cuarto de lavado");
            if (pnlGYM.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Gimnasio");
            if (pnlVigilancia.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Vigilancia 24h");
            if (pnlFracPriv.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Fraccionamiento privado");
            if (pnlCuartoServicio.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Cuarto de servicio");
            if (pnlAsador.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Área de asador");
            if (pnlTinaco.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Tinaco");
            if (pnlChimenea.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Chimenea");
            if (pnlAC.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Aire acondicionado");
            if (pnlCalefaccion.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Calefacción");
            if (pnlElevador.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Elevador");
            if (pnlPortonElectrico.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Portón eléctrico");
            if (pnlMantIncluido.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Mantenimiento incluido");
            if (pnlUbiEsquina.Tag.ToString() == "encendido") amenidadesSeleccionadas.Add("Ubicación en esquina");

            // 2. Llamar al siguiente formulario (propiedadinfo5)
            try
            {
                propiedadinfo5 formSiguiente = new propiedadinfo5(
                    this, // El owner (propiedadinfo4)
                    this.usuarioLogueado,
                    // Info 1
                    this.tipoPropiedad,
                    this.tipoOperacion,
                    this.municipio,
                    this.calleyNumero,
                    this.numExterior,
                    this.colonia,
                    this.cp,
                    this.coordenadas,
                    // Info 2
                    this.titulo,
                    this.descripcion,
                    this.precio,
                    this.antiguedad,
                    this.listaRutasImagenes,
                    // Info 3
                    this.m2Construccion,
                    this.m2Terreno,
                    this.recamaras,
                    this.banos,
                    this.mediosBanos,
                    this.estacionamiento,
                    // Info 4 (NUEVO)
                    amenidadesSeleccionadas
                );

                // 3. Navegar
                formSiguiente.Show();
                this.Hide();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error al abrir 'propiedadinfo5': " + ex.Message);
            }
        }

        // --- 7. Lógica del Panel de Avatar ---
        private void picAvatar_Click(object sender, EventArgs e)
        {
            Point screenPoint = picAvatar.PointToScreen(Point.Empty);
            Point formPoint = this.PointToClient(screenPoint);
            panel2.Left = formPoint.X - panel2.Width + picAvatar.Width;
            panel2.Top = formPoint.Y + picAvatar.Height;
            panel2.Visible = !panel2.Visible;
            panel2.BringToFront();
        }

        private void labelcerrarsesion_Click(object sender, EventArgs e)
        {
            frmMenuPrincipal menuPrincipalNuevo = new frmMenuPrincipal();
            menuPrincipalNuevo.Show();
            this.Close();
        }
    }
}