using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    public class FlowPanelRedondeado : FlowLayoutPanel
    {
        // Propiedades para ponerlo "coqueto"
        public int RadioEsquinas { get; set; } = 20;
        public Color ColorInicio { get; set; } = Color.White;
        public Color ColorFinal { get; set; } = Color.White; // Si es igual al inicio, es color sólido
        public int AnguloDegradado { get; set; } = 45; // Dirección del degradado
        public Color ColorBorde { get; set; } = Color.PaleVioletRed;
        public int TamanoBorde { get; set; } = 0;

        public FlowPanelRedondeado()
        {
            this.DoubleBuffered = true; // VITAL: Evita que las imágenes parpadeen al hacer scroll
            this.BackColor = Color.Transparent;
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            Graphics graph = e.Graphics;
            graph.SmoothingMode = SmoothingMode.AntiAlias;

            Rectangle rectClient = new Rectangle(0, 0, this.Width, this.Height);
            Rectangle rectBorde = new Rectangle(0, 0, this.Width - 1, this.Height - 1);

            // Lógica para el degradado o color sólido
            using (GraphicsPath path = GetRoundPath(rectClient, RadioEsquinas))
            using (GraphicsPath pathBorde = GetRoundPath(rectBorde, RadioEsquinas))
            using (Pen penBorde = new Pen(ColorBorde, TamanoBorde))
            {
                // Definir el pincel (Sólido o Degradado)
                Brush brushFondo;
                if (ColorInicio != ColorFinal)
                {
                    brushFondo = new LinearGradientBrush(rectClient, ColorInicio, ColorFinal, AnguloDegradado);
                }
                else
                {
                    brushFondo = new SolidBrush(ColorInicio);
                }

                // Dibujar
                graph.FillPath(brushFondo, path); // Fondo

                if (TamanoBorde > 0)
                {
                    graph.DrawPath(penBorde, pathBorde); // Borde
                }

                // Limpieza
                if (brushFondo is IDisposable) brushFondo.Dispose();
            }
        }

        // La matemática de las curvas (igual que tus otros controles)
        private GraphicsPath GetRoundPath(Rectangle rect, int radius)
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
    }
}