// --- USINGS NECESARIOS ---
using System;
using System.Collections.Generic; // Para List<string>
using System.Drawing; // Para Image, Font, Color, Point
using System.Windows.Forms; // Para Form, Panel, etc.
using System.IO; // Para File.ReadAllBytes y MemoryStream

namespace Inmoviral3._0
{
    public partial class propiedadinfo2 : Form
    {
        // --- 1. Variables Miembro ---
        private propiedadinfo1 ownerForm;
        private Usuarios usuarioLogueado;
        private string tipoPropiedad;
        private string tipoOperacion;
        private string municipio;
        private string calleyNumero;
        private string numExterior;
        private string colonia;
        private string cp;
        private string coordenadas;

        private List<string> listaRutasImagenes = new List<string>();
        private const int MAX_IMAGENES = 10;

        // --- 2. Constructor ---
        public propiedadinfo2(
            propiedadinfo1 owner,
            Usuarios usuario,
            string tipoProp,
            string tipoOp,
            string municipio,
            string calleyNumero,
            string numExterior,
            string colonia,
            string cp,
            string coordenadas)
        {
            InitializeComponent();

            // ... (Guarda los datos recibidos) ...
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

            // Muestra el nombre de usuario
            if (this.usuarioLogueado != null && labelnombreuser != null)
            {
                labelnombreuser.Text = "Hola, " + this.usuarioLogueado.Usuario;
            }
            if (panel2 != null)
            {
                panel2.Visible = false;
            }

            // El panel SIEMPRE está visible
            flpThumbnails.Visible = true;

            // Llamamos a la lógica para establecer el estado inicial
            ActualizarEstadoBotones();
        }

        // --- 3. Lógica de Carga de Imágenes ---

        // Evento Click del PictureBox GRANDE (pictureBox2)
        private void pictureBox2_Click(object sender, EventArgs e)
        {
            AbrirDialogoFotos();
        }

        // Evento Click del PictureBox PEQUEÑO (pictureBox4)
        private void pictureBox4_Click(object sender, EventArgs e)
        {
            AbrirDialogoFotos();
        }

        // Método centralizado para abrir el diálogo
        private void AbrirDialogoFotos()
        {
            if (listaRutasImagenes.Count >= MAX_IMAGENES)
            {
                MessageBox.Show($"Ya has alcanzado el límite de {MAX_IMAGENES} fotos.", "Límite alcanzado");
                return;
            }

            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Multiselect = true;
            ofd.Filter = "Archivos de Imagen|*.jpg;*.jpeg;*.png;*.bmp";
            int fotosRestantes = MAX_IMAGENES - listaRutasImagenes.Count;
            ofd.Title = $"Selecciona tus fotos (puedes subir {fotosRestantes} más)";

            if (ofd.ShowDialog() == DialogResult.OK)
            {
                foreach (string rutaImagen in ofd.FileNames)
                {
                    if (listaRutasImagenes.Count < MAX_IMAGENES)
                    {
                        if (!listaRutasImagenes.Contains(rutaImagen))
                        {
                            listaRutasImagenes.Add(rutaImagen);
                            CrearThumbnail(rutaImagen); // 1. Crea la "imagencita"
                        }
                    }
                    else
                    {
                        MessageBox.Show("Límite de 10 fotos alcanzado. Algunas imágenes no se agregaron.", "Límite alcanzado");
                        break;
                    }
                }

                // 2. Mueve el botón "+" pequeño (pictureBox4) al final
                flpThumbnails.Controls.SetChildIndex(pictureBox4, flpThumbnails.Controls.Count - 1);
            }

            // 3. Actualiza la visibilidad de los botones
            ActualizarEstadoBotones();
        }

        // Método para crear el "panel pequeño" (thumbnail)
        private void CrearThumbnail(string rutaImagen)
        {
            Panel pnlThumbnail = new Panel();
            pnlThumbnail.Size = new Size(130, 130);
            pnlThumbnail.BorderStyle = BorderStyle.FixedSingle;
            pnlThumbnail.Margin = new Padding(5);

            PictureBox pic = new PictureBox();
            pic.Size = new Size(126, 126);
            pic.Location = new Point(2, 2);
            pic.SizeMode = PictureBoxSizeMode.Zoom;

            try
            {
                byte[] bytes = File.ReadAllBytes(rutaImagen);
                using (MemoryStream ms = new MemoryStream(bytes))
                {
                    pic.Image = Image.FromStream(ms);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error al cargar imagen: " + ex.Message);
                pic.Image = pic.ErrorImage;
            }

            Label lblRemove = new Label();
            lblRemove.Text = "X";
            lblRemove.Font = new Font("Arial", 10, FontStyle.Bold);
            lblRemove.ForeColor = Color.White;
            lblRemove.BackColor = Color.Red;
            lblRemove.BorderStyle = BorderStyle.FixedSingle;
            lblRemove.AutoSize = false;
            lblRemove.Size = new Size(20, 20);
            lblRemove.Location = new Point(pnlThumbnail.Width - lblRemove.Width - 2, 2);
            lblRemove.TextAlign = ContentAlignment.MiddleCenter;
            lblRemove.Cursor = Cursors.Hand;
            lblRemove.Tag = rutaImagen;
            lblRemove.Click += new EventHandler(lblRemove_Click);

            pnlThumbnail.Controls.Add(pic);
            pnlThumbnail.Controls.Add(lblRemove);
            lblRemove.BringToFront();

            // Solo agregamos la foto (la lógica de reordenar está en 'AbrirDialogoFotos')
            flpThumbnails.Controls.Add(pnlThumbnail);
        }

        // --- ¡EL ÚNICO Y CORRECTO MÉTODO! ---
        // Controla la visibilidad de AMBOS botones "+"
        private void ActualizarEstadoBotones()
        {
            if (listaRutasImagenes.Count == 0)
            {
                // No hay fotos: Muestra el botón grande, oculta el pequeño
                pictureBox2.Visible = true;
                pictureBox4.Visible = false;
            }
            else if (listaRutasImagenes.Count < MAX_IMAGENES)
            {
                // Hay fotos: OCULTA el grande, MUESTRA el pequeño
                pictureBox2.Visible = false;
                pictureBox4.Visible = true;
            }
            else // (listaRutasImagenes.Count >= MAX_IMAGENES)
            {
                // Límite alcanzado: Oculta ambos botones "+"
                pictureBox2.Visible = false;
                pictureBox4.Visible = false;
            }
        }

        // Evento Click para el label de "Eliminar" (X)
        private void lblRemove_Click(object sender, EventArgs e)
        {
            Label lbl = sender as Label;
            string rutaParaEliminar = lbl.Tag.ToString();
            Panel pnl = lbl.Parent as Panel;

            listaRutasImagenes.Remove(rutaParaEliminar);
            flpThumbnails.Controls.Remove(pnl);
            pnl.Dispose();

            // Actualiza los botones (para que reaparezca el "+")
            ActualizarEstadoBotones();
        }

        // --- 4. Lógica de Navegación ---
        private void btnContinuar_Click(object sender, EventArgs e)
        {
            if (listaRutasImagenes.Count < 5)
            {
                MessageBox.Show("Debes agregar un mínimo de 5 fotos.");
                return;
            }
            // ... (Validaciones de Precio y Antigüedad) ...
            MessageBox.Show("¡Validación exitosa! (Aquí iría el código para avanzar)");
        }

        private void label13_Click(object sender, EventArgs e)
        {
            if (this.ownerForm != null) { this.ownerForm.Show(); }
            this.Close();
        }

        // --- 5. Lógica del Panel de Avatar ---
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

        // --- 6. Eventos de Placeholders y Validación de Teclas ---
        private void TextBox_Enter(object sender, EventArgs e)
        {
            TextBox textBoxActual = sender as TextBox;
            if (textBoxActual.Tag != null && textBoxActual.Text == textBoxActual.Tag.ToString())
            {
                textBoxActual.Text = "";
                textBoxActual.ForeColor = SystemColors.WindowText;
            }
        }

        private void TextBox_Leave(object sender, EventArgs e)
        {
            TextBox textBoxActual = sender as TextBox;
            if (textBoxActual.Tag != null && string.IsNullOrWhiteSpace(textBoxActual.Text))
            {
                textBoxActual.Text = textBoxActual.Tag.ToString();
                textBoxActual.ForeColor = SystemColors.GrayText;
            }
        }

        private void txtNumeros_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (!char.IsDigit(e.KeyChar) && !char.IsControl(e.KeyChar))
            {
                e.Handled = true;
            }
        }

        private void txtLetras_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (!char.IsLetter(e.KeyChar) && !char.IsControl(e.KeyChar) && !char.IsSeparator(e.KeyChar))
            {
                e.Handled = true;
            }
        }

        private void propiedadinfo2_Load(object sender, EventArgs e)
        {
            this.ActiveControl = label7; // Reemplaza 'label7' si es otro
        }

        // --- 4. Lógica de Navegación ---
        private void btnContinuar_Click1(object sender, EventArgs e)
        {
            // --- 1. Validación de Fotos ---
            if (listaRutasImagenes.Count < 5)
            {
                MessageBox.Show("Debes agregar un mínimo de 5 fotos.");
                return; // Detiene la ejecución
            }

            // --- 2. Validación de Campos de Texto (Corregido con tus nombres) ---

            // Chequeo de Título (textBox1)
            if (string.IsNullOrWhiteSpace(textBox1.Text) || (textBox1.Tag != null && textBox1.Text == textBox1.Tag.ToString()))
            {
                MessageBox.Show("Por favor, completa el campo 'Título'.");
                textBox1.Focus(); // Pone el cursor en el campo
                return;
            }

            // Chequeo de Descripción (textBox2)
            if (string.IsNullOrWhiteSpace(textBox2.Text) || (textBox2.Tag != null && textBox2.Text == textBox2.Tag.ToString()))
            {
                MessageBox.Show("Por favor, completa el campo 'Descripción'.");
                textBox2.Focus();
                return;
            }

            // Chequeo de Precio (textBox4)
            if (string.IsNullOrWhiteSpace(textBox4.Text) || (textBox4.Tag != null && textBox4.Text == textBox4.Tag.ToString()))
            {
                MessageBox.Show("Por favor, completa el campo 'Precio'.");
                textBox4.Focus();
                return;
            }

            // Chequeo de Antigüedad (textBox3)
            if (string.IsNullOrWhiteSpace(textBox3.Text) || (textBox3.Tag != null && textBox3.Text == textBox3.Tag.ToString()))
            {
                MessageBox.Show("Por favor, completa el campo 'Antigüedad'.");
                textBox3.Focus();
                return;
            }

            // --- 3. Si todo es válido: Recolecta y Navega ---

            // 3a. Recolecta los datos nuevos de este formulario
            string titulo = textBox1.Text;
            string descripcion = textBox2.Text;
            string precio = textBox4.Text; // Corregido
            string antiguedad = textBox3.Text; // Corregido

            // 3b. Crea la instancia del siguiente formulario (propiedadinfo3)
            try
            {
                propiedadinfo3 formSiguiente = new propiedadinfo3(
                    this,                     // El owner (propiedadinfo2)
                    this.usuarioLogueado,
                    this.tipoPropiedad,
                    this.tipoOperacion,
                    this.municipio,
                    this.calleyNumero,
                    this.numExterior,
                    this.colonia,
                    this.cp,
                    this.coordenadas,
                    titulo,                   // Dato nuevo
                    descripcion,              // Dato nuevo
                    precio,                   // Dato nuevo
                    antiguedad,               // Dato nuevo
                    this.listaRutasImagenes   // La lista de fotos
                );

                // 3c. Navega al siguiente formulario
                formSiguiente.Show();
                this.Hide();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error al abrir 'propiedadinfo3': " + ex.Message);
            }
        }
    } // Fin de la clase
} // Fin del namespace