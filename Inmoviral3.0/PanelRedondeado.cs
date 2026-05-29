using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace Inmoviral3._0 // Aseguate que este namespace coincida con el de tu proyecto
{
    public class PanelRedondeado : Panel
    {
        // Propiedades para configurar desde el diseño
        public int RadioEsquinas { get; set; } = 20; // Qué tan redonda es la esquina
        public Color ColorBorde { get; set; } = Color.PaleVioletRed; // Color del borde opcional
        public int TamanoBorde { get; set; } = 0; // Grosor del borde (pon 0 si no quieres borde)

        // Constructor
        public PanelRedondeado()
        {
            this.DoubleBuffered = true; // Evita parpadeos al redibujar
            this.BackColor = Color.White;
        }

        // Método mágico que dibuja la forma
        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            Graphics graph = e.Graphics;

            // Activar suavizado para que no se vean "dientes de sierra" en las curvas
            graph.SmoothingMode = SmoothingMode.AntiAlias;

            Rectangle rectFondo = new Rectangle(0, 0, this.Width, this.Height);
            Rectangle rectBorde = new Rectangle(0, 0, this.Width - 1, this.Height - 1);

            // Crear los caminos (las formas geométricas)
            using (GraphicsPath pathFondo = GetRoundPath(rectFondo, RadioEsquinas))
            using (GraphicsPath pathBorde = GetRoundPath(rectBorde, RadioEsquinas))
            using (Pen penFondo = new Pen(this.Parent.BackColor, 1)) // "Borra" las esquinas cuadradas pintando del color del fondo padre
            using (Pen penBorde = new Pen(ColorBorde, TamanoBorde))
            using (SolidBrush brushFondo = new SolidBrush(this.BackColor))
            {
                // 1. Dibujar el fondo redondeado
                this.Region = new Region(pathFondo); // Esto recorta el click al área redonda
                graph.FillPath(brushFondo, pathFondo);

                // 2. Dibujar el borde (si existe)
                if (TamanoBorde > 0)
                {
                    graph.DrawPath(penBorde, pathBorde);
                }
            }
        }

        // Función auxiliar para calcular las curvas
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