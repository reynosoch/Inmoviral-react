// --- REEMPLAZA TODO EN propiedadinfo5.cs CON ESTO ---

using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    public partial class propiedadinfo5 : Form
    {
        // --- 1. Variables Miembro (para guardar TODO) ---
        private propiedadinfo4 ownerForm;
        private Usuarios usuarioLogueado;

        // ... (todas tus variables de Info 1, 2, 3, 4) ...
        #region Variables Miembro
        private string tipoPropiedad;
        private string tipoOperacion;
        private string municipio;
        private string calleyNumero;
        private string numExterior;
        private string colonia;
        private string cp;
        private string coordenadas;
        private string titulo;
        private string descripcion;
        private string precio;
        private string antiguedad;
        private List<string> listaRutasImagenes;
        private string m2Construccion;
        private string m2Terreno;
        private string recamaras;
        private string banos;
        private string mediosBanos;
        private string estacionamiento;
        private List<string> listaAmenidades;
        #endregion

        // Colores para el "toggle"
        Color colorEncendido = Color.FromArgb(255, 230, 204); // Naranja claro
        Color colorApagado = Color.WhiteSmoke; // Blanco/Gris claro

        // --- 2. Constructor ---
        public propiedadinfo5(
            propiedadinfo4 owner,
            Usuarios usuario,
            // Info 1
            string tipoProp, string tipoOp, string municipio, string calleyNumero,
            string numExterior, string colonia, string cp, string coordenadas,
            // Info 2
            string titulo, string descripcion, string precio, string antiguedad,
            List<string> listaRutas,
            // Info 3
            string m2Construccion, string m2Terreno, string recamaras, string banos,
            string mediosBanos, string estacionamiento,
            // Info 4
            List<string> amenidades
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
            this.listaAmenidades = amenidades;

            // Asigna el nombre de usuario
            if (this.usuarioLogueado != null && labelnombreuser != null)
            {
                labelnombreuser.Text = "Hola, " + this.usuarioLogueado.Usuario;
            }
        }

        // --- 4. Lógica del Formulario ---

        // ----- ¡MÉTODO CORREGIDO Y UNIFICADO! -----
        private void propiedadinfo5_Load(object sender, EventArgs e)
        {
            // Inicializa el estado "apagado" de los servicios
            InicializarAmenidad(pnlMudanza);
            InicializarAmenidad(pnlLimpieza);
            InicializarAmenidad(pnlFotografia);
            InicializarAmenidad(pnlRedesSociales);

            if (pnlCompra != null)
            {
                pnlCompra.Visible = false; // Asegúrate de que el panel pop-up esté oculto
            }
        }

        // Botón de "Atrás"
        private void btnAtras_Click(object sender, EventArgs e)
        {
            if (this.ownerForm != null)
            {
                this.ownerForm.Show(); // Muestra propiedadinfo4 de nuevo
            }
            this.Close();
        }

        // Botón "Guardar y Publicar" (Tu botón "Finalizar")
        // (¡CORREGIDO! Se añadió la lógica de recolectar servicios)
        private void btnPublicar_Click(object sender, EventArgs e)
        {
            // 1. Recolectar los servicios extra seleccionados
            List<string> serviciosSeleccionados = new List<string>();
            if (pnlMudanza?.Tag?.ToString() == "encendido") serviciosSeleccionados.Add("Mudanza");
            if (pnlLimpieza?.Tag?.ToString() == "encendido") serviciosSeleccionados.Add("Limpieza");
            if (pnlFotografia?.Tag?.ToString() == "encendido") serviciosSeleccionados.Add("Fotografía");
            if (pnlRedesSociales?.Tag?.ToString() == "encendido") serviciosSeleccionados.Add("Redes Sociales");

            // 2. Comprobar si se seleccionó algún servicio
            if (serviciosSeleccionados.Count > 0)
            {
                // Si SÍ seleccionó, mostrar el panel de compra
                pnlCompra.Visible = true;
                pnlCompra.BringToFront();
            }
            else
            {
                // Si NO seleccionó, finalizar la publicación directamente
                FinalizarPublicacion(true);
            }
        }


        // --- 5. Lógica de "Toggle" para Servicios ---
        #region Lógica de Toggle
        private void InicializarAmenidad(Panel pnl)
        {
            if (pnl == null) return;
            pnl.Tag = "apagado";
            pnl.BackColor = colorApagado;
            if (pnl.Controls.Count > 0)
            {
                pnl.Controls[0].BackColor = Color.Transparent;
            }
        }

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

            if (panelObjetivo.Tag == null || panelObjetivo.Tag.ToString() == "apagado")
            {
                panelObjetivo.Tag = "encendido";
                panelObjetivo.BackColor = colorEncendido;
                if (panelObjetivo.Controls.Count > 0)
                {
                    panelObjetivo.Controls[0].BackColor = colorEncendido;
                }
            }
            else
            {
                panelObjetivo.Tag = "apagado";
                panelObjetivo.BackColor = colorApagado;
                if (panelObjetivo.Controls.Count > 0)
                {
                    panelObjetivo.Controls[0].BackColor = Color.Transparent;
                }
            }
        }
        #endregion

        // --- 7. Lógica del Panel de Avatar ---
        private void picAvatar_Click(object sender, EventArgs e)
        {
            Point screenPoint = picAvatar.PointToScreen(Point.Empty);
            Point formPoint = this.PointToClient(screenPoint);
            panel3.Left = formPoint.X - panel3.Width + picAvatar.Width;
            panel3.Top = formPoint.Y + picAvatar.Height;
            panel3.Visible = !panel3.Visible;
            panel3.BringToFront();
        }

        // --- Lógica de Guardado y Navegación ---

        private void FinalizarPublicacion(bool irAMenuPrincipal = true)
        {
            // 1. Recolectar los servicios
            List<string> serviciosSeleccionados = new List<string>();
            if (pnlMudanza?.Tag?.ToString() == "encendido") serviciosSeleccionados.Add("Mudanza");
            if (pnlLimpieza?.Tag?.ToString() == "encendido") serviciosSeleccionados.Add("Limpieza");
            if (pnlFotografia?.Tag?.ToString() == "encendido") serviciosSeleccionados.Add("Fotografía");
            if (pnlRedesSociales?.Tag?.ToString() == "encendido") serviciosSeleccionados.Add("Redes Sociales");

            try
            {
                // --- 2. LLAMADA REAL A LA BASE DE DATOS ---
                Modelo modelo = new Modelo();

                long nuevoIdPublicacion = modelo.GuardarPublicacionCompleta(
                    // Usuario
                    this.usuarioLogueado.Id,
                    // Info 1
                    this.tipoPropiedad, this.tipoOperacion, this.municipio, this.calleyNumero,
                    this.numExterior, this.colonia, this.cp, this.coordenadas,
                    // Info 2
                    this.titulo, this.descripcion, this.precio, this.antiguedad,
                    this.listaRutasImagenes,
                    // Info 3
                    this.m2Construccion, this.m2Terreno, this.recamaras, this.banos,
                    this.mediosBanos, this.estacionamiento,
                    // Info 4
                    this.listaAmenidades,
                    // Info 5
                    serviciosSeleccionados
                );
                // --- 3. Lógica de Navegación ---
                if (irAMenuPrincipal)
                {
                    frmMenuPrincipal menu = new frmMenuPrincipal(this.usuarioLogueado);
                    menu.Show();
                }
                else
                {
                    // ¡AQUÍ ESTÁ EL CAMBIO!
                    // Pasamos el ID Y el objeto 'usuarioLogueado'
                    frmPublicacion verPublicacion = new frmPublicacion((int)nuevoIdPublicacion, this.usuarioLogueado);
                    verPublicacion.Show();
                }

                // 4. Cierra toda la cadena de formularios
                this.Close(); // Cierra info5
                if (this.ownerForm != null)
                {
                    this.ownerForm.Close(); // Cierra info4
                    if (this.ownerForm.Owner != null)
                    {
                        this.ownerForm.Owner.Close(); // Cierra info3
                        if (this.ownerForm.Owner.Owner != null)
                        {
                            this.ownerForm.Owner.Owner.Close(); // Cierra info2
                            if (this.ownerForm.Owner.Owner.Owner != null)
                            {
                                this.ownerForm.Owner.Owner.Owner.Close(); // Cierra info1
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error final al guardar: " + ex.Message, "Error de Base de Datos", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        // --- Lógica del Pop-up pnlCompra ---

        private void btnVerPublicacion_Click(object sender, EventArgs e)
        {
            // Finalizar y NO ir al menú (para que nos lleve a frmPublicacion)
            FinalizarPublicacion(false);
        }

        private void lblquitar_Click(object sender, EventArgs e)
        {
            pnlCompra.Visible = false;
        }

    } // Fin de la clase
} // Fin del namespace