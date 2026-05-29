namespace Inmoviral3._0
{
    partial class TarjetaPropiedad
    {
        /// <summary> 
        /// Variable del diseñador necesaria.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Limpiar los recursos que se estén usando.
        /// </summary>
        /// <param name="disposing">true si los recursos administrados se deben desechar; false en caso contrario.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Código generado por el Diseñador de componentes

        /// <summary> 
        /// Método necesario para admitir el Diseñador. No se puede modificar
        /// el contenido de este método con el editor de código.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(TarjetaPropiedad));
            picCasa = new PictureBoxRedondeado();
            btnFavorito = new PictureBox();
            lblPrecio = new Label();
            lblTitulo = new Label();
            lblDetalles = new Label();
            lblUbicacion = new Label();
            btnFavoritoRojo = new PictureBox();
            ((System.ComponentModel.ISupportInitialize)picCasa).BeginInit();
            ((System.ComponentModel.ISupportInitialize)btnFavorito).BeginInit();
            ((System.ComponentModel.ISupportInitialize)btnFavoritoRojo).BeginInit();
            SuspendLayout();
            // 
            // picCasa
            // 
            picCasa.BackColor = Color.LightGray;
            picCasa.BorderRadius = 15;
            picCasa.Cursor = Cursors.Hand;
            picCasa.Dock = DockStyle.Top;
            picCasa.Location = new Point(0, 0);
            picCasa.Name = "picCasa";
            picCasa.Size = new Size(300, 180);
            picCasa.SizeMode = PictureBoxSizeMode.StretchImage;
            picCasa.TabIndex = 0;
            picCasa.TabStop = false;
            // 
            // btnFavorito
            // 
            btnFavorito.BackColor = Color.Transparent;
            btnFavorito.Cursor = Cursors.Hand;
            btnFavorito.Image = (Image)resources.GetObject("btnFavorito.Image");
            btnFavorito.Location = new Point(218, 0);
            btnFavorito.Name = "btnFavorito";
            btnFavorito.Size = new Size(79, 73);
            btnFavorito.SizeMode = PictureBoxSizeMode.StretchImage;
            btnFavorito.TabIndex = 2;
            btnFavorito.TabStop = false;
            btnFavorito.Click += btnFavorito_Click;
            // 
            // lblPrecio
            // 
            lblPrecio.AutoSize = true;
            lblPrecio.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
            lblPrecio.Location = new Point(3, 183);
            lblPrecio.Name = "lblPrecio";
            lblPrecio.Size = new Size(83, 32);
            lblPrecio.TabIndex = 3;
            lblPrecio.Text = "label1";
            // 
            // lblTitulo
            // 
            lblTitulo.AutoSize = true;
            lblTitulo.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            lblTitulo.Location = new Point(3, 226);
            lblTitulo.Name = "lblTitulo";
            lblTitulo.Size = new Size(70, 28);
            lblTitulo.TabIndex = 4;
            lblTitulo.Text = "label1";
            // 
            // lblDetalles
            // 
            lblDetalles.AutoSize = true;
            lblDetalles.Font = new Font("Segoe UI", 12F);
            lblDetalles.Location = new Point(3, 267);
            lblDetalles.Name = "lblDetalles";
            lblDetalles.Size = new Size(65, 28);
            lblDetalles.TabIndex = 5;
            lblDetalles.Text = "label1";
            // 
            // lblUbicacion
            // 
            lblUbicacion.AutoSize = true;
            lblUbicacion.Font = new Font("Segoe UI", 12F);
            lblUbicacion.Location = new Point(3, 306);
            lblUbicacion.Name = "lblUbicacion";
            lblUbicacion.Size = new Size(65, 28);
            lblUbicacion.TabIndex = 6;
            lblUbicacion.Text = "label1";
            // 
            // btnFavoritoRojo
            // 
            btnFavoritoRojo.BackColor = Color.Transparent;
            btnFavoritoRojo.Cursor = Cursors.Hand;
            btnFavoritoRojo.Image = (Image)resources.GetObject("btnFavoritoRojo.Image");
            btnFavoritoRojo.Location = new Point(218, 0);
            btnFavoritoRojo.Name = "btnFavoritoRojo";
            btnFavoritoRojo.Size = new Size(79, 73);
            btnFavoritoRojo.SizeMode = PictureBoxSizeMode.StretchImage;
            btnFavoritoRojo.TabIndex = 7;
            btnFavoritoRojo.TabStop = false;
            btnFavoritoRojo.Visible = false;
            btnFavoritoRojo.Click += btnFavoritoRojo_Click;
            // 
            // TarjetaPropiedad
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(btnFavoritoRojo);
            Controls.Add(lblUbicacion);
            Controls.Add(lblDetalles);
            Controls.Add(lblTitulo);
            Controls.Add(lblPrecio);
            Controls.Add(btnFavorito);
            Controls.Add(picCasa);
            Name = "TarjetaPropiedad";
            Size = new Size(300, 350);
            ((System.ComponentModel.ISupportInitialize)picCasa).EndInit();
            ((System.ComponentModel.ISupportInitialize)btnFavorito).EndInit();
            ((System.ComponentModel.ISupportInitialize)btnFavoritoRojo).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private PictureBoxRedondeado picCasa;
        private PictureBox btnFavorito;
        private Label lblPrecio;
        private Label lblTitulo;
        private Label lblDetalles;
        private Label lblUbicacion;
        private PictureBox btnFavoritoRojo;
    }
}
