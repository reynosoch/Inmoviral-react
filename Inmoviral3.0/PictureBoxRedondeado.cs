using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace Inmoviral3._0
{
    public class PictureBoxRedondeado : PictureBox
    {
        // Propiedad para definir qué tan redonda es la esquina
        public int BorderRadius { get; set; } = 20;

        public PictureBoxRedondeado()
        {
            this.BackColor = Color.LightGray; // Color de fondo por si no carga la imagen
            this.SizeMode = PictureBoxSizeMode.StretchImage; // Ajuste por defecto
        }

        protected override void OnPaint(PaintEventArgs pe)
        {
            // 1. Creamos el rectángulo del tamaño de la imagen
            Rectangle rect = new Rectangle(0, 0, this.Width, this.Height);

            // 2. Creamos la ruta (la forma redonda)
            using (GraphicsPath path = GetRoundPath(rect, BorderRadius))
            {
                // 3. ESTO ES LA CLAVE: Aplicamos la región al control
                // Esto "recorta" físicamente el control a la forma redonda
                this.Region = new Region(path);

                // 4. Dibujamos la imagen base (Windows lo hace por nosotros, pero con el recorte aplicado)
                base.OnPaint(pe);

                // 5. Opcional: Dibujar un borde suave para evitar dientes de sierra (anti-alias visual)
                pe.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                /* Si quisieras un borde de color, descomenta esto:
                using (Pen pen = new Pen(Color.White, 1)) 
                {
                    pe.Graphics.DrawPath(pen, path);
                }
                */
            }
        }

        // Función matemática para las curvas (la misma que usamos en tus otros controles)
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