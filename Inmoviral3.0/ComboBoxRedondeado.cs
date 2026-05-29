using System;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    [DefaultEvent("OnSelectedIndexChanged")]
    public class ComboBoxRedondeado : UserControl
    {
        // Colores y Propiedades
        private Color backColor = Color.WhiteSmoke;
        private Color iconColor = Color.MediumSlateBlue;
        private Color listBackColor = Color.FromArgb(230, 228, 245);
        private Color listTextColor = Color.DimGray;
        private Color borderColor = Color.MediumSlateBlue;
        private int borderSize = 1;
        private int borderRadius = 15; // Redondez

        // El ComboBox real que vive adentro
        private ComboBox cmbList;
        private Label lblText;
        private Button btnIcon;

        // Eventos
        public event EventHandler OnSelectedIndexChanged;

        public ComboBoxRedondeado()
        {
            cmbList = new ComboBox();
            lblText = new Label();
            btnIcon = new Button();
            this.SuspendLayout();

            // Configurar el ComboBox interno
            cmbList.BackColor = listBackColor;
            cmbList.Font = new Font(this.Font.Name, 10F);
            cmbList.ForeColor = listTextColor;
            cmbList.SelectedIndexChanged += new EventHandler(ComboBox_SelectedIndexChanged);
            cmbList.TextChanged += new EventHandler(ComboBox_TextChanged);
            // Truco para ocultar bordes feos
            cmbList.Dock = DockStyle.Fill;
            cmbList.FlatStyle = FlatStyle.Flat;

            // Configurar el botón (Flecha)
            btnIcon.Dock = DockStyle.Right;
            btnIcon.FlatStyle = FlatStyle.Flat;
            btnIcon.FlatAppearance.BorderSize = 0;
            btnIcon.BackColor = backColor;
            btnIcon.Size = new Size(30, 30);
            btnIcon.Cursor = Cursors.Hand;
            btnIcon.Click += new EventHandler(Icon_Click);
            btnIcon.Paint += new PaintEventHandler(Icon_Paint);

            // Configurar etiqueta de texto
            lblText.Dock = DockStyle.Fill;
            lblText.AutoSize = false;
            lblText.BackColor = backColor;
            lblText.TextAlign = ContentAlignment.MiddleLeft;
            lblText.Padding = new Padding(8, 0, 0, 0);
            lblText.Font = new Font(this.Font.Name, 10F);
            lblText.Click += new EventHandler(Surface_Click);
            lblText.MouseEnter += new EventHandler(Surface_MouseEnter);
            lblText.MouseLeave += new EventHandler(Surface_MouseLeave);

            // Controles del UserControl
            this.Controls.Add(lblText); // El texto va encima
            this.Controls.Add(btnIcon); // El icono a la derecha
            this.Controls.Add(cmbList); // La lista está oculta debajo o detrás visualmente

            this.MinimumSize = new Size(200, 30);
            this.Size = new Size(200, 30);
            this.Padding = new Padding(1); // Borde
            this.ForeColor = Color.DimGray;
            this.BackColor = backColor; // Importante: NO Transparent para evitar el error anterior
            this.ResumeLayout(false);

            AdjustComboBoxDimensions();
        }

        // Propiedades para editar desde el diseño
        [Category("InmoViral Code - Apariencia")]
        public new Color BackColor
        {
            get { return backColor; }
            set
            {
                backColor = value;
                lblText.BackColor = backColor;
                btnIcon.BackColor = backColor;
                base.BackColor = backColor;
            }
        }

        [Category("InmoViral Code - Apariencia")]
        public Color IconColor { get { return iconColor; } set { iconColor = value; btnIcon.Invalidate(); } }

        [Category("InmoViral Code - Apariencia")]
        public Color BorderColor { get { return borderColor; } set { borderColor = value; base.BackColor = borderColor; } }

        [Category("InmoViral Code - Apariencia")]
        public int BorderRadius { get { return borderRadius; } set { borderRadius = value; this.Invalidate(); } }

        [Category("InmoViral Code - Apariencia")]
        public int BorderSize { get { return borderSize; } set { borderSize = value; this.Padding = new Padding(borderSize); AdjustComboBoxDimensions(); } }

        [Category("InmoViral Code - Data")]
        public ComboBox.ObjectCollection Items { get { return cmbList.Items; } }

        [Category("InmoViral Code - Data")]
        public object DataSource { get { return cmbList.DataSource; } set { cmbList.DataSource = value; } }

        [Category("InmoViral Code - Data")]
        public string DisplayMember { get { return cmbList.DisplayMember; } set { cmbList.DisplayMember = value; } }

        [Category("InmoViral Code - Data")]
        public string ValueMember { get { return cmbList.ValueMember; } set { cmbList.ValueMember = value; } }

        [Category("InmoViral Code - Data")]
        public override string Text { get { return lblText.Text; } set { lblText.Text = value; } }

        [Category("InmoViral Code - Data")]
        public int SelectedIndex { get { return cmbList.SelectedIndex; } set { cmbList.SelectedIndex = value; } }

        [Category("InmoViral Code - Data")]
        public object SelectedItem { get { return cmbList.SelectedItem; } set { cmbList.SelectedItem = value; } }

        // Eventos privados
        private void Surface_MouseEnter(object sender, EventArgs e) { this.OnMouseEnter(e); }
        private void Surface_MouseLeave(object sender, EventArgs e) { this.OnMouseLeave(e); }

        private void ComboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (OnSelectedIndexChanged != null) OnSelectedIndexChanged.Invoke(sender, e);
            lblText.Text = cmbList.Text;
        }

        private void ComboBox_TextChanged(object sender, EventArgs e) { lblText.Text = cmbList.Text; }

        private void Icon_Click(object sender, EventArgs e) { cmbList.Select(); cmbList.DroppedDown = true; }

        private void Surface_Click(object sender, EventArgs e)
        {
            this.OnClick(e);
            cmbList.Select();
            if (cmbList.DropDownStyle == ComboBoxStyle.DropDownList)
                cmbList.DroppedDown = true;
        }

        // Dibujar el icono de la flecha
        private void Icon_Paint(object sender, PaintEventArgs e)
        {
            int iconWidht = 14;
            int iconHeight = 6;
            var rectIcon = new Rectangle((btnIcon.Width - iconWidht) / 2, (btnIcon.Height - iconHeight) / 2, iconWidht, iconHeight);
            Graphics graph = e.Graphics;

            using (GraphicsPath path = new GraphicsPath())
            using (Pen pen = new Pen(iconColor, 2))
            {
                graph.SmoothingMode = SmoothingMode.AntiAlias;
                path.AddLine(rectIcon.X, rectIcon.Y, rectIcon.X + (iconWidht / 2), rectIcon.Bottom);
                path.AddLine(rectIcon.X + (iconWidht / 2), rectIcon.Bottom, rectIcon.Right, rectIcon.Y);
                graph.DrawPath(pen, path);
            }
        }

        // Redondear el control completo
        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            Rectangle rectBorder = this.ClientRectangle;
            rectBorder.Width -= 1;
            rectBorder.Height -= 1;

            Graphics graph = e.Graphics;
            graph.SmoothingMode = SmoothingMode.AntiAlias;

            using (GraphicsPath pathBorder = GetFigurePath(rectBorder, borderRadius))
            using (Pen penBorder = new Pen(borderColor, borderSize))
            using (SolidBrush brushSurface = new SolidBrush(backColor))
            {
                this.Region = new Region(pathBorder); // Recorta a la forma
                graph.FillPath(brushSurface, pathBorder);
                if (borderSize >= 1) graph.DrawPath(penBorder, pathBorder);
            }
        }

        // Matemática de curvas (reutilizada)
        private GraphicsPath GetFigurePath(Rectangle rect, int radius)
        {
            GraphicsPath path = new GraphicsPath();
            float curveSize = radius * 2F;
            path.StartFigure();
            path.AddArc(rect.X, rect.Y, curveSize, curveSize, 180, 90);
            path.AddArc(rect.Right - curveSize, rect.Y, curveSize, curveSize, 270, 90);
            path.AddArc(rect.Right - curveSize, rect.Bottom - curveSize, curveSize, curveSize, 0, 90);
            path.AddArc(rect.X, rect.Bottom - curveSize, curveSize, curveSize, 90, 90);
            path.CloseFigure();
            return path;
        }

        private void AdjustComboBoxDimensions()
        {
            cmbList.Width = this.Width - this.Padding.Horizontal;
            cmbList.Location = new Point(this.Padding.Left, lblText.Bottom - cmbList.Height - this.Padding.Bottom);
        }
    }
}