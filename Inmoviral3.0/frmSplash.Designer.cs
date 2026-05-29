namespace Inmoviral3._0
{
    partial class frmSplash
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmSplash));
            pbxGif = new PictureBox();
            ((System.ComponentModel.ISupportInitialize)pbxGif).BeginInit();
            SuspendLayout();
            // 
            // pbxGif
            // 
            pbxGif.Dock = DockStyle.Fill;
            pbxGif.Image = (Image)resources.GetObject("pbxGif.Image");
            pbxGif.Location = new Point(0, 0);
            pbxGif.Name = "pbxGif";
            pbxGif.Size = new Size(711, 319);
            pbxGif.SizeMode = PictureBoxSizeMode.Zoom;
            pbxGif.TabIndex = 0;
            pbxGif.TabStop = false;
            pbxGif.Click += pbxGif_Click;
            // 
            // frmSplash
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(711, 319);
            Controls.Add(pbxGif);
            FormBorderStyle = FormBorderStyle.None;
            Name = "frmSplash";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "frmSplash";
            WindowState = FormWindowState.Maximized;
            Load += frmSplash_Load;
            ((System.ComponentModel.ISupportInitialize)pbxGif).EndInit();
            ResumeLayout(false);
        }

        #endregion
        private PictureBox pbxGif;
    }
}