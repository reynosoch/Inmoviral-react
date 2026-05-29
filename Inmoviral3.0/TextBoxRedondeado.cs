using System;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    [DefaultEvent("_TextChanged")]
    public class TextBoxRedondeado : UserControl
    {
        // Campos
        private Color colorBorde = Color.MediumSlateBlue;
        private int borderSize = 2;
        private bool underlinedStyle = false;
        private Color colorFondo = Color.White;
        private int radioEsquinas = 15;
        private TextBox textBox1 = new TextBox();

        // Eventos
        public event EventHandler _TextChanged;

        public TextBoxRedondeado()
        {
            this.DoubleBuffered = true;
            this.Padding = new Padding(10, 7, 10, 7); // Margen interior
            this.Size = new Size(250, 30);

            // Configurar el TextBox interno (el que realmente escribe)
            textBox1.BorderStyle = BorderStyle.None;
            textBox1.Dock = DockStyle.Fill;
            textBox1.BackColor = this.BackColor;
            textBox1.TextChanged += TextBox1_TextChanged;
            textBox1.Enter += TextBox1_Enter;
            textBox1.Leave += TextBox1_Leave;

            this.Controls.Add(textBox1);
            this.BackColor = Color.White; // Importante para las curvas
        }

        // Propiedades expuestas
        [Category("Propiedades InmoViral")]
        public Color BorderColor { get => colorBorde; set { colorBorde = value; this.Invalidate(); } }

        [Category("Propiedades InmoViral")]
        public int BorderSize { get => borderSize; set { borderSize = value; this.Invalidate(); } }

        [Category("Propiedades InmoViral")]
        public bool UnderlinedStyle { get => underlinedStyle; set { underlinedStyle = value; this.Invalidate(); } }

        [Category("Propiedades InmoViral")]
        public int BorderRadius { get => radioEsquinas; set { radioEsquinas = value; this.Invalidate(); } }

        [Category("Propiedades InmoViral")]
        public override Color BackColor { get => base.BackColor; set { base.BackColor = value; textBox1.BackColor = value; } }

        [Category("Propiedades InmoViral")]
        public override string Text { get => textBox1.Text; set => textBox1.Text = value; }

        [Category("Propiedades InmoViral")]
        public bool Multiline { get => textBox1.Multiline; set => textBox1.Multiline = value; }

        // Eventos burbujeados
        private void TextBox1_TextChanged(object sender, EventArgs e) { if (_TextChanged != null) _TextChanged.Invoke(sender, e); }
        private void TextBox1_Enter(object sender, EventArgs e) { this.Invalidate(); }
        private void TextBox1_Leave(object sender, EventArgs e) { this.Invalidate(); }

        // Dibujar el control
        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            Graphics graph = e.Graphics;

            // Dibujamos en alta calidad
            graph.SmoothingMode = SmoothingMode.AntiAlias;

            using (GraphicsPath path = GetFigurePath(this.ClientRectangle, radioEsquinas))
            using (Pen penBorder = new Pen(colorBorde, borderSize))
            using (SolidBrush brushBg = new SolidBrush(colorFondo)) // Usar colorFondo explícito si es necesario
            {
                // Ajuste para que el borde no se corte
                if (borderSize >= 1)
                {
                    graph.DrawPath(penBorder, path);
                }
            }
        }

        // Método para ajustar el tamaño del TextBox interno cuando cambias el tamaño del control
        protected override void OnResize(EventArgs e)
        {
            base.OnResize(e);
            if (this.DesignMode) UpdateControlHeight();
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            UpdateControlHeight();
        }

        private void UpdateControlHeight()
        {
            if (textBox1.Multiline == false)
            {
                int txtHeight = TextRenderer.MeasureText("Text", this.Font).Height + 1;
                textBox1.Multiline = true;
                textBox1.MinimumSize = new Size(0, txtHeight);
                textBox1.Multiline = false;
                this.Height = textBox1.Height + this.Padding.Top + this.Padding.Bottom;
            }
        }

        // Matemática para las curvas (Igual que tu Panel)
        private GraphicsPath GetFigurePath(RectangleF rect, float radius)
        {
            GraphicsPath path = new GraphicsPath();
            path.StartFigure();
            path.AddArc(rect.X, rect.Y, radius, radius, 180, 90);
            path.AddArc(rect.Width - radius, rect.Y, radius, radius, 270, 90);
            path.AddArc(rect.Width - radius, rect.Height - radius, radius, radius, 0, 90);
            path.AddArc(rect.X, rect.Height - radius, radius, radius, 90, 90);
            path.CloseFigure();
            return path;
        }
    }
}