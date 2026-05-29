using Microsoft.VisualBasic.Logging;

namespace Inmoviral3._0
{
    partial class frmLogin : Form
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmLogin));
            panelRegistro = new Panel();
            btnLoginTab = new Button();
            panel1 = new Panel();
            label4 = new Label();
            btnIniciarSesion = new Button();
            txtPassword = new TextBox();
            txtUsuario = new TextBox();
            label3 = new Label();
            label1 = new Label();
            label2 = new Label();
            pictureBox2 = new PictureBox();
            panelLogin = new Panel();
            btnRegistroTab = new Button();
            pictureBox3 = new PictureBox();
            labelmenup = new Label();
            panelRegistro.SuspendLayout();
            panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)pictureBox2).BeginInit();
            panelLogin.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)pictureBox3).BeginInit();
            SuspendLayout();
            // 
            // panelRegistro
            // 
            panelRegistro.BorderStyle = BorderStyle.FixedSingle;
            panelRegistro.Controls.Add(btnLoginTab);
            panelRegistro.Location = new Point(1201, 309);
            panelRegistro.Name = "panelRegistro";
            panelRegistro.Size = new Size(220, 59);
            panelRegistro.TabIndex = 18;
            // 
            // btnLoginTab
            // 
            btnLoginTab.BackColor = SystemColors.ActiveBorder;
            btnLoginTab.Cursor = Cursors.Hand;
            btnLoginTab.FlatAppearance.BorderSize = 0;
            btnLoginTab.FlatStyle = FlatStyle.Flat;
            btnLoginTab.Location = new Point(20, 6);
            btnLoginTab.Name = "btnLoginTab";
            btnLoginTab.Size = new Size(175, 41);
            btnLoginTab.TabIndex = 0;
            btnLoginTab.Text = "Iniciar sesión";
            btnLoginTab.UseVisualStyleBackColor = false;
            // 
            // panel1
            // 
            panel1.BackColor = Color.Transparent;
            panel1.BorderStyle = BorderStyle.FixedSingle;
            panel1.Controls.Add(label4);
            panel1.Controls.Add(btnIniciarSesion);
            panel1.Controls.Add(txtPassword);
            panel1.Controls.Add(txtUsuario);
            panel1.Controls.Add(label3);
            panel1.Controls.Add(label1);
            panel1.Controls.Add(label2);
            panel1.Location = new Point(1013, 367);
            panel1.Name = "panel1";
            panel1.Size = new Size(638, 428);
            panel1.TabIndex = 16;
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Font = new Font("Segoe UI", 12F);
            label4.Location = new Point(51, 331);
            label4.Name = "label4";
            label4.Size = new Size(0, 28);
            label4.TabIndex = 7;
            // 
            // btnIniciarSesion
            // 
            btnIniciarSesion.BackColor = Color.DarkOrange;
            btnIniciarSesion.Cursor = Cursors.Hand;
            btnIniciarSesion.FlatAppearance.BorderColor = Color.White;
            btnIniciarSesion.FlatAppearance.BorderSize = 10;
            btnIniciarSesion.Font = new Font("Segoe UI", 12F);
            btnIniciarSesion.ForeColor = Color.Black;
            btnIniciarSesion.Location = new Point(84, 286);
            btnIniciarSesion.Name = "btnIniciarSesion";
            btnIniciarSesion.Size = new Size(474, 73);
            btnIniciarSesion.TabIndex = 6;
            btnIniciarSesion.Text = "Iniciar sesión";
            btnIniciarSesion.UseVisualStyleBackColor = false;
            btnIniciarSesion.Click += btnIniciarSesion_Click;
            // 
            // txtPassword
            // 
            txtPassword.Cursor = Cursors.IBeam;
            txtPassword.Font = new Font("Segoe UI", 12F);
            txtPassword.ForeColor = SystemColors.InactiveCaption;
            txtPassword.Location = new Point(51, 180);
            txtPassword.Name = "txtPassword";
            txtPassword.PasswordChar = '*';
            txtPassword.Size = new Size(535, 34);
            txtPassword.TabIndex = 3;
            txtPassword.Tag = "*****";
            txtPassword.Text = "*****";
            txtPassword.Enter += TextBox_Enter;
            txtPassword.Leave += TextBox_Leave;
            // 
            // txtUsuario
            // 
            txtUsuario.Cursor = Cursors.IBeam;
            txtUsuario.Font = new Font("Segoe UI", 12F);
            txtUsuario.ForeColor = SystemColors.InactiveCaption;
            txtUsuario.Location = new Point(51, 76);
            txtUsuario.Name = "txtUsuario";
            txtUsuario.Size = new Size(535, 34);
            txtUsuario.TabIndex = 1;
            txtUsuario.Tag = "Ej. Tilin12";
            txtUsuario.Text = "Ej. Tilin12";
            txtUsuario.Enter += TextBox_Enter;
            txtUsuario.Leave += TextBox_Leave;
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Font = new Font("Segoe UI", 12F);
            label3.Location = new Point(51, 234);
            label3.Name = "label3";
            label3.Size = new Size(0, 28);
            label3.TabIndex = 4;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Segoe UI", 12F);
            label1.Location = new Point(51, 35);
            label1.Name = "label1";
            label1.Size = new Size(83, 28);
            label1.TabIndex = 0;
            label1.Text = "Usuario:";
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Font = new Font("Segoe UI", 12F);
            label2.Location = new Point(51, 137);
            label2.Name = "label2";
            label2.Size = new Size(114, 28);
            label2.TabIndex = 2;
            label2.Text = "Contraseña:";
            // 
            // pictureBox2
            // 
            pictureBox2.Image = (Image)resources.GetObject("pictureBox2.Image");
            pictureBox2.Location = new Point(955, 50);
            pictureBox2.Name = "pictureBox2";
            pictureBox2.Size = new Size(767, 224);
            pictureBox2.SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox2.TabIndex = 15;
            pictureBox2.TabStop = false;
            // 
            // panelLogin
            // 
            panelLogin.BorderStyle = BorderStyle.FixedSingle;
            panelLogin.Controls.Add(btnRegistroTab);
            panelLogin.Location = new Point(1013, 309);
            panelLogin.Name = "panelLogin";
            panelLogin.Size = new Size(191, 59);
            panelLogin.TabIndex = 17;
            // 
            // btnRegistroTab
            // 
            btnRegistroTab.BackColor = Color.Transparent;
            btnRegistroTab.Cursor = Cursors.Hand;
            btnRegistroTab.FlatAppearance.BorderSize = 0;
            btnRegistroTab.FlatStyle = FlatStyle.Flat;
            btnRegistroTab.Location = new Point(13, 7);
            btnRegistroTab.Name = "btnRegistroTab";
            btnRegistroTab.Size = new Size(165, 45);
            btnRegistroTab.TabIndex = 15;
            btnRegistroTab.Text = "Regístrate";
            btnRegistroTab.UseVisualStyleBackColor = false;
            btnRegistroTab.Click += btnRegistroTab_Click;
            // 
            // pictureBox3
            // 
            pictureBox3.Image = Properties.Resources.image_89;
            pictureBox3.Location = new Point(1, -2);
            pictureBox3.Name = "pictureBox3";
            pictureBox3.Size = new Size(791, 1279);
            pictureBox3.SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox3.TabIndex = 19;
            pictureBox3.TabStop = false;
            // 
            // labelmenup
            // 
            labelmenup.AutoSize = true;
            labelmenup.Cursor = Cursors.Hand;
            labelmenup.Font = new Font("Segoe UI", 12F, FontStyle.Bold | FontStyle.Underline);
            labelmenup.Location = new Point(1569, 19);
            labelmenup.Name = "labelmenup";
            labelmenup.Size = new Size(169, 28);
            labelmenup.TabIndex = 20;
            labelmenup.Text = "<Menú principal";
            labelmenup.Click += labelmenup_Click;
            // 
            // frmLogin
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1814, 881);
            Controls.Add(labelmenup);
            Controls.Add(pictureBox3);
            Controls.Add(panelRegistro);
            Controls.Add(panel1);
            Controls.Add(pictureBox2);
            Controls.Add(panelLogin);
            Name = "frmLogin";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Iniciar sesión:)";
            WindowState = FormWindowState.Maximized;
            Load += Login_Load;
            panelRegistro.ResumeLayout(false);
            panel1.ResumeLayout(false);
            panel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)pictureBox2).EndInit();
            panelLogin.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)pictureBox3).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private PictureBox pictureBox1;
        private Panel panelRegistro;
        private Button btnLoginTab;
        private Panel panel1;
        private Label label4;
        private Button btnIniciarSesion;
        private TextBox txtPassword;
        private TextBox txtUsuario;
        private Label label3;
        private Label label1;
        private Label label2;
        private PictureBox pictureBox2;
        private Panel panelLogin;
        private Button btnRegistroTab;
        private PictureBox pictureBox3;
        private Label labelmenup;
    }
}