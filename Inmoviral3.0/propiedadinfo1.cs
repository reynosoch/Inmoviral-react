using System;
using System.Drawing;
using System.Globalization;
using System.Net.Http; // Necesario para HttpClient
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Newtonsoft.Json.Linq;
using System.Net; // Para 'WebUtility'
using System.Collections.Generic; // Para List<string>

namespace Inmoviral3._0
{
    public partial class propiedadinfo1 : Form
    {
        // --- Variables Miembro ---
        private ventayrenta ownerForm;
        private Usuarios usuarioLogueado;
        private string tipoPropiedad;
        private string tipoOperacion;
        private static readonly HttpClient client = new HttpClient();

        // --- Constructor Corregido ---
        public propiedadinfo1(ventayrenta owner, Usuarios usuario, string tipoProp, string tipoOp)
        {
            InitializeComponent();

            // Guarda los 4 datos
            this.ownerForm = owner;
            this.usuarioLogueado = usuario;
            this.tipoPropiedad = tipoProp;
            this.tipoOperacion = tipoOp;

            // --- ¡SOLUCIÓN AQUÍ! ---
            // 1. Muestra el nombre de usuario en el label
            if (usuarioLogueado != null && labelnombreuser != null)
            {
                labelnombreuser.Text = "Hola, " + usuarioLogueado.Usuario;
            }

            // 2. Oculta el panel del avatar al cargar
            if (panel2 != null)
            {
                panel2.Visible = false;
            }
            // --- FIN DE LA SOLUCIÓN ---

            // Oculta el panel de precio al inicio
            if (panel1 != null)
            {
                panel1.Visible = false;
            }

            InitializeAsync();
        }

        // --- 1. INICIALIZA EL MAPA ---
        async void InitializeAsync()
        {
            try
            {
                await webView21.EnsureCoreWebView2Async(null);
                webView21.CoreWebView2.WebMessageReceived += RecibirMensajeDeJavaScript;
                string htmlPath = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "mapa.html");
                webView21.CoreWebView2.Navigate(new Uri(htmlPath).AbsoluteUri);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error al inicializar el mapa: " + ex.Message, "Error WebView2");
            }
        }

        // --- 2. RECIBE EL CLIC DEL MAPA ---
        async void RecibirMensajeDeJavaScript(object sender, CoreWebView2WebMessageReceivedEventArgs args)
        {
            try
            {
                JObject message = JObject.Parse(args.WebMessageAsJson);
                string messageType = message["type"]?.ToString();

                if (messageType == "mapClick")
                {
                    double lat = message["latitude"].ToObject<double>();
                    double lon = message["longitude"].ToObject<double>();
                    DireccionInfo direccion = await ObtenerDireccionDesdeCoordsAsync(lat, lon);

                    this.Invoke((MethodInvoker)delegate
                    {
                        if (direccion != null)
                        {
                            string latString = lat.ToString(CultureInfo.InvariantCulture);
                            string lonString = lon.ToString(CultureInfo.InvariantCulture);
                            txtCoordenadas.Text = $"{latString}, {lonString}";
                            txtCalleyNumero.Text = $"{direccion.Calle} {direccion.Numero}".Trim();
                            txtMunicipio.Text = direccion.Municipio;
                            txtCP.Text = direccion.CodigoPostal;

                            // Actualiza color de placeholders
                            if (!string.IsNullOrWhiteSpace(txtCoordenadas.Text)) txtCoordenadas.ForeColor = SystemColors.WindowText;
                            if (!string.IsNullOrWhiteSpace(txtCalleyNumero.Text)) txtCalleyNumero.ForeColor = SystemColors.WindowText;
                            if (!string.IsNullOrWhiteSpace(txtMunicipio.Text)) txtMunicipio.ForeColor = SystemColors.WindowText;
                            if (!string.IsNullOrWhiteSpace(txtCP.Text)) txtCP.ForeColor = SystemColors.WindowText;
                        }
                        else
                        {
                            MessageBox.Show("No se pudo obtener la dirección para estas coordenadas.", "Geocodificación Inversa");
                        }
                    });
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error procesando mensaje de JS: {ex.Message}");
            }
        }

        // --- 3. BÚSQUEDA DE DIRECCIÓN (Geocodificación) ---
        private async Task BuscarDireccionEnMapa()
        {
            var parts = new List<string>();

            // Lógica para construir la dirección limpiando placeholders
            if (txtCalleyNumero.Tag != null && txtCalleyNumero.Text != txtCalleyNumero.Tag.ToString() && !string.IsNullOrWhiteSpace(txtCalleyNumero.Text))
                parts.Add(txtCalleyNumero.Text.Trim());
            if (txtNumExterior.Tag != null && txtNumExterior.Text != txtNumExterior.Tag.ToString() && !string.IsNullOrWhiteSpace(txtNumExterior.Text))
                parts.Add(txtNumExterior.Text.Trim());
            if (txtMunicipio.Tag != null && txtMunicipio.Text != txtMunicipio.Tag.ToString() && !string.IsNullOrWhiteSpace(txtMunicipio.Text))
                parts.Add(txtMunicipio.Text.Trim());
            if (txtCP.Tag != null && txtCP.Text != txtCP.Tag.ToString() && !string.IsNullOrWhiteSpace(txtCP.Text))
                parts.Add(txtCP.Text.Trim());

            if (parts.Count == 0)
            {
                MessageBox.Show("Por favor, introduce al menos una calle o municipio.", "Datos insuficientes");
                return;
            }

            parts.Add("Mexico"); // Añade contexto
            string direccionCompleta = string.Join(", ", parts);

            Tuple<double, double> coords = await ObtenerCoordsDesdeDireccionAsync(direccionCompleta);

            if (coords != null)
            {
                double lat = coords.Item1;
                double lon = coords.Item2;
                string jsonMessage = $"{{\"type\":\"setMapCenter\", \"latitude\":{lat.ToString(CultureInfo.InvariantCulture)}, \"longitude\":{lon.ToString(CultureInfo.InvariantCulture)}}}";

                if (webView21 != null && webView21.CoreWebView2 != null)
                {
                    webView21.CoreWebView2.PostWebMessageAsJson(jsonMessage);
                }
            }
            else
            {
                MessageBox.Show("No se pudo encontrar esa dirección. Intenta ser más específico.", "Búsqueda no encontrada");
            }
        }

        // Evento para un botón de "Buscar"
        private async void btnBuscar_Click(object sender, EventArgs e)
        {
            await BuscarDireccionEnMapa();
        }

        private async Task<Tuple<double, double>> ObtenerCoordsDesdeDireccionAsync(string direccion)
        {
            string urlEncodedAddress = WebUtility.UrlEncode(direccion);
            string url = $"https://nominatim.openstreetmap.org/search?q={urlEncodedAddress}&format=json&limit=1&countrycodes=mx";
            try
            {
                client.DefaultRequestHeaders.UserAgent.Clear();
                client.DefaultRequestHeaders.UserAgent.ParseAdd("InmoviralApp/1.0 (tuemail@ejemplo.com)"); // ¡CAMBIA ESTO!
                HttpResponseMessage response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                JArray results = JArray.Parse(responseBody);
                if (results.Count > 0)
                {
                    JToken firstResult = results[0];
                    double lat = firstResult["lat"].ToObject<double>();
                    double lon = firstResult["lon"].ToObject<double>();
                    return Tuple.Create(lat, lon);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error Geocoding API: {ex.Message}");
            }
            return null;
        }

        // --- 4. CLASE AUXILIAR Y API (Geo-Inversa) ---
        public class DireccionInfo
        {
            public string Calle { get; set; }
            public string Numero { get; set; }
            public string Municipio { get; set; }
            public string CodigoPostal { get; set; }
        }

        private async Task<DireccionInfo> ObtenerDireccionDesdeCoordsAsync(double lat, double lon)
        {
            string url = $"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat.ToString(CultureInfo.InvariantCulture)}&lon={lon.ToString(CultureInfo.InvariantCulture)}&addressdetails=1";
            try
            {
                client.DefaultRequestHeaders.UserAgent.Clear();
                client.DefaultRequestHeaders.UserAgent.ParseAdd("InmoviralApp/1.0 (tuemail@ejemplo.com)");
                HttpResponseMessage response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                JObject result = JObject.Parse(responseBody);
                if (result["address"] != null)
                {
                    JToken address = result["address"];
                    return new DireccionInfo
                    {
                        Calle = address["road"]?.ToString() ?? "",
                        Numero = address["house_number"]?.ToString() ?? "",
                        Municipio = address["county"]?.ToString() ??
                                      address["city"]?.ToString() ??
                                      address["town"]?.ToString() ??
                                      address["village"]?.ToString() ?? "",
                        CodigoPostal = address["postcode"]?.ToString() ?? ""
                    };
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error Reverse Geocoding API: {ex.Message}");
            }
            return null;
        }

        // --- 5. MÉTODOS PARA PLACEHOLDERS ---
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

        // --- 6. NAVEGACIÓN "ATRÁS" (BOTÓN) ---
        private void btnAtras_Click(object sender, EventArgs e)
        {
            if (this.ownerForm != null)
            {
                this.ownerForm.Show();
            }
            this.Close();
        }

        // --- 7. EVENTO DEL CHECKBOX 'S/N' ---
        private void checkBoxSN_CheckedChanged(object sender, EventArgs e)
        {
            if (checkBoxSN.Checked)
            {
                txtNumExterior.Text = "s/n";
                txtNumExterior.ForeColor = SystemColors.GrayText;
                txtNumExterior.Enabled = false;
            }
            else
            {
                txtNumExterior.Enabled = true;
                if (txtNumExterior.Tag != null)
                {
                    txtNumExterior.Text = txtNumExterior.Tag.ToString();
                }
                else
                {
                    txtNumExterior.Text = "";
                }
                txtNumExterior.ForeColor = SystemColors.GrayText;
            }
        }

        // --- 8. EVENTO DEL BOTÓN 'CONTINUAR' (MUESTRA EL PANEL DE PRECIO) ---
        private void btnContinuar_Click(object sender, EventArgs e)
        {
            if ((string.IsNullOrWhiteSpace(txtCalleyNumero.Text) || txtCalleyNumero.Text == txtCalleyNumero.Tag?.ToString()) ||
                 (string.IsNullOrWhiteSpace(txtMunicipio.Text) || txtMunicipio.Text == txtMunicipio.Tag?.ToString()) ||
                 (string.IsNullOrWhiteSpace(txtCP.Text) || txtCP.Text == txtCP.Tag?.ToString()) ||
                 string.IsNullOrWhiteSpace(txtCoordenadas.Text))
            {
                MessageBox.Show("Por favor, completa todos los campos de dirección (Municipio, Calle, CP) y selecciona un punto en el mapa.", "Campos incompletos");
                return;
            }

            panel1.Visible = true;
            panel1.BringToFront();
        }

        // --- 9. EVENTO DEL BOTÓN 'CONFIRMAR' (DENTRO DEL PANEL1) ---
        private void btnConfirmar_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(textBox1.Text) || textBox1.Text == textBox1.Tag?.ToString())
            {
                MessageBox.Show("Por favor, introduce la colonia.", "Campo incompleto");
                return;
            }
            string colonia = textBox1.Text.Trim();

            string municipio = (txtMunicipio.Tag == null || txtMunicipio.Text != txtMunicipio.Tag.ToString()) ? txtMunicipio.Text.Trim() : "";
            string calleyNumero = (txtCalleyNumero.Tag == null || txtCalleyNumero.Text != txtCalleyNumero.Tag.ToString()) ? txtCalleyNumero.Text.Trim() : "";
            string cp = (txtCP.Tag == null || txtCP.Text != txtCP.Tag.ToString()) ? txtCP.Text.Trim() : "";
            string coordenadas = txtCoordenadas.Text;

            string numExterior = checkBoxSN.Checked ? "s/n" : ((txtNumExterior.Tag == null || txtNumExterior.Text != txtNumExterior.Tag.ToString()) ? txtNumExterior.Text.Trim() : "");

            panel1.Visible = false;

            // Navegar al siguiente formulario (propiedadinfo2)
            propiedadinfo2 formSiguiente = new propiedadinfo2(
                this,
                this.usuarioLogueado,
                this.tipoPropiedad,
                this.tipoOperacion,
                municipio,
                calleyNumero,
                numExterior,
                colonia,
                cp,
                coordenadas
            );

            formSiguiente.Show();
            this.Hide();
        }

        // --- 10. MÉTODO NUEVO PARA CERRAR EL PANEL (label21) ---
        private void label21_Click(object sender, EventArgs e)
        {
            panel1.Visible = false;
        }

        // --- NAVEGACIÓN "ATRÁS" (Label 8) ---
        private void label8_Click(object sender, EventArgs e)
        {
            if (this.ownerForm != null)
            {
                this.ownerForm.Show();
            }
            this.Close();
        }

        // --- MANEJO DEL PANEL DE AVATAR ---
        private void picAvatar_Click(object sender, EventArgs e)
        {
            Point screenPoint = picAvatar.PointToScreen(Point.Empty);
            Point formPoint = this.PointToClient(screenPoint);

            panel2.Left = formPoint.X - panel2.Width + picAvatar.Width;
            panel2.Top = formPoint.Y + picAvatar.Height;
            panel2.Visible = !panel2.Visible; // Muestra/Oculta el panel
            panel2.BringToFront();
        }

    } // Fin de la clase propiedadinfo1
} // Fin del namespace