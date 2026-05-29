namespace Inmoviral3._0
{
    partial class frmRegistro
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
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
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmRegistro));
            label1 = new Label();
            txtUsuario = new TextBox();
            txtPassword = new TextBox();
            label2 = new Label();
            txtConPassword = new TextBox();
            label3 = new Label();
            btnRegistrar = new Button();
            txtNombre = new TextBox();
            label4 = new Label();
            pictureBox1 = new PictureBox();
            pictureBox2 = new PictureBox();
            panel1 = new Panel();
            chkTerminos = new CheckBox();
            txtTelefono = new TextBox();
            label7 = new Label();
            txtCorreo = new TextBox();
            txtApellidos = new TextBox();
            label6 = new Label();
            label5 = new Label();
            panelLogin = new Panel();
            btnRegistroTab = new Button();
            panelRegistro = new Panel();
            btnLoginTab = new Button();
            toolTip1 = new ToolTip(components);
            labelmenup = new Label();
            pictureBox3 = new PictureBox();
            ((System.ComponentModel.ISupportInitialize)pictureBox1).BeginInit();
            ((System.ComponentModel.ISupportInitialize)pictureBox2).BeginInit();
            panel1.SuspendLayout();
            panelLogin.SuspendLayout();
            panelRegistro.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)pictureBox3).BeginInit();
            SuspendLayout();
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
            // txtConPassword
            // 
            txtConPassword.Cursor = Cursors.IBeam;
            txtConPassword.Font = new Font("Segoe UI", 12F);
            txtConPassword.ForeColor = SystemColors.InactiveCaption;
            txtConPassword.Location = new Point(51, 275);
            txtConPassword.Name = "txtConPassword";
            txtConPassword.PasswordChar = '*';
            txtConPassword.Size = new Size(535, 34);
            txtConPassword.TabIndex = 5;
            txtConPassword.Tag = "*****";
            txtConPassword.Text = "*****";
            txtConPassword.Enter += TextBox_Enter;
            txtConPassword.Leave += TextBox_Leave;
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Font = new Font("Segoe UI", 12F);
            label3.Location = new Point(51, 234);
            label3.Name = "label3";
            label3.Size = new Size(203, 28);
            label3.TabIndex = 4;
            label3.Text = "Confirmar contraseña:";
            // 
            // btnRegistrar
            // 
            btnRegistrar.BackColor = Color.DarkOrange;
            btnRegistrar.Cursor = Cursors.Hand;
            btnRegistrar.FlatAppearance.BorderColor = Color.White;
            btnRegistrar.FlatAppearance.BorderSize = 10;
            btnRegistrar.Font = new Font("Segoe UI", 12F);
            btnRegistrar.ForeColor = Color.Black;
            btnRegistrar.Location = new Point(79, 780);
            btnRegistrar.Name = "btnRegistrar";
            btnRegistrar.Size = new Size(474, 73);
            btnRegistrar.TabIndex = 6;
            btnRegistrar.Text = "Registrarte";
            toolTip1.SetToolTip(btnRegistrar, "\"Debes aceptar los términos y condiciones para poder registrarte.\"");
            btnRegistrar.UseVisualStyleBackColor = false;
            btnRegistrar.Click += btnRegistrar_Click;
            // 
            // txtNombre
            // 
            txtNombre.Cursor = Cursors.IBeam;
            txtNombre.Font = new Font("Segoe UI", 12F);
            txtNombre.ForeColor = SystemColors.InactiveCaption;
            txtNombre.Location = new Point(51, 372);
            txtNombre.Name = "txtNombre";
            txtNombre.Size = new Size(535, 34);
            txtNombre.TabIndex = 8;
            txtNombre.Tag = "Ej. Victor";
            txtNombre.Text = "Ej. Victor";
            txtNombre.TextChanged += txtNombre_TextChanged;
            txtNombre.Enter += TextBox_Enter;
            txtNombre.KeyPress += txtNombre_KeyPress;
            txtNombre.Leave += TextBox_Leave;
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Font = new Font("Segoe UI", 12F);
            label4.Location = new Point(51, 331);
            label4.Name = "label4";
            label4.Size = new Size(109, 28);
            label4.TabIndex = 7;
            label4.Text = "Nombre(s):";
            // 
            // pictureBox1
            // 
            pictureBox1.Image = Properties.Resources.image_89;
            pictureBox1.Location = new Point(1, -2);
            pictureBox1.Name = "pictureBox1";
            pictureBox1.Size = new Size(791, 1279);
            pictureBox1.SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox1.TabIndex = 9;
            pictureBox1.TabStop = false;
            // 
            // pictureBox2
            // 
            pictureBox2.Image = (Image)resources.GetObject("pictureBox2.Image");
            pictureBox2.Location = new Point(955, 50);
            pictureBox2.Name = "pictureBox2";
            pictureBox2.Size = new Size(767, 224);
            pictureBox2.SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox2.TabIndex = 10;
            pictureBox2.TabStop = false;
            // 
            // panel1
            // 
            panel1.BackColor = Color.Transparent;
            panel1.BorderStyle = BorderStyle.FixedSingle;
            panel1.Controls.Add(chkTerminos);
            panel1.Controls.Add(txtTelefono);
            panel1.Controls.Add(txtNombre);
            panel1.Controls.Add(txtConPassword);
            panel1.Controls.Add(label7);
            panel1.Controls.Add(label4);
            panel1.Controls.Add(btnRegistrar);
            panel1.Controls.Add(txtPassword);
            panel1.Controls.Add(txtCorreo);
            panel1.Controls.Add(txtApellidos);
            panel1.Controls.Add(txtUsuario);
            panel1.Controls.Add(label3);
            panel1.Controls.Add(label6);
            panel1.Controls.Add(label5);
            panel1.Controls.Add(label1);
            panel1.Controls.Add(label2);
            panel1.Controls.Add(pictureBox2);
            panel1.Location = new Point(1013, 367);
            panel1.Name = "panel1";
            panel1.Size = new Size(638, 888);
            panel1.TabIndex = 12;
            // 
            // chkTerminos
            // 
            chkTerminos.AutoSize = true;
            chkTerminos.Cursor = Cursors.Hand;
            chkTerminos.Location = new Point(187, 740);
            chkTerminos.Name = "chkTerminos";
            chkTerminos.Size = new Size(235, 24);
            chkTerminos.TabIndex = 21;
            chkTerminos.Text = "Acepto terminos y condiciones";
            chkTerminos.UseVisualStyleBackColor = true;
            chkTerminos.CheckedChanged += checkBox1_CheckedChanged;
            // 
            // txtTelefono
            // 
            txtTelefono.Cursor = Cursors.IBeam;
            txtTelefono.Font = new Font("Segoe UI", 12F);
            txtTelefono.ForeColor = SystemColors.InactiveCaption;
            txtTelefono.Location = new Point(51, 683);
            txtTelefono.Name = "txtTelefono";
            txtTelefono.Size = new Size(535, 34);
            txtTelefono.TabIndex = 20;
            txtTelefono.Tag = "Ej. 6145042075";
            txtTelefono.Text = "Ej. 6145042075";
            txtTelefono.Enter += TextBox_Enter;
            txtTelefono.KeyPress += txtTelefono_KeyPress;
            txtTelefono.Leave += TextBox_Leave;
            // 
            // label7
            // 
            label7.AutoSize = true;
            label7.Font = new Font("Segoe UI", 12F);
            label7.Location = new Point(51, 640);
            label7.Name = "label7";
            label7.Size = new Size(90, 28);
            label7.TabIndex = 19;
            label7.Text = "Télefono:";
            // 
            // txtCorreo
            // 
            txtCorreo.Cursor = Cursors.IBeam;
            txtCorreo.Font = new Font("Segoe UI", 12F);
            txtCorreo.ForeColor = SystemColors.InactiveCaption;
            txtCorreo.Location = new Point(51, 583);
            txtCorreo.Name = "txtCorreo";
            txtCorreo.Size = new Size(535, 34);
            txtCorreo.TabIndex = 18;
            txtCorreo.Tag = "Ej. VictorMendivil@gmail.com";
            txtCorreo.Text = "Ej. VictorMendivil@gmail.com";
            txtCorreo.Enter += TextBox_Enter;
            txtCorreo.Leave += TextBox_Leave;
            // 
            // txtApellidos
            // 
            txtApellidos.Cursor = Cursors.IBeam;
            txtApellidos.Font = new Font("Segoe UI", 12F);
            txtApellidos.ForeColor = SystemColors.InactiveCaption;
            txtApellidos.Location = new Point(51, 477);
            txtApellidos.Name = "txtApellidos";
            txtApellidos.Size = new Size(535, 34);
            txtApellidos.TabIndex = 16;
            txtApellidos.Tag = "Ej. Mendivil";
            txtApellidos.Text = "Ej. Mendivil";
            txtApellidos.Enter += TextBox_Enter;
            txtApellidos.KeyPress += txtApellidos_KeyPress;
            txtApellidos.Leave += TextBox_Leave;
            // 
            // label6
            // 
            label6.AutoSize = true;
            label6.Font = new Font("Segoe UI", 12F);
            label6.Location = new Point(51, 532);
            label6.Name = "label6";
            label6.Size = new Size(178, 28);
            label6.TabIndex = 17;
            label6.Text = "Correo electrónico:";
            // 
            // label5
            // 
            label5.AutoSize = true;
            label5.Font = new Font("Segoe UI", 12F);
            label5.Location = new Point(51, 429);
            label5.Name = "label5";
            label5.Size = new Size(106, 28);
            label5.TabIndex = 15;
            label5.Text = "Apellido(s)";
            // 
            // panelLogin
            // 
            panelLogin.BorderStyle = BorderStyle.FixedSingle;
            panelLogin.Controls.Add(btnRegistroTab);
            panelLogin.Location = new Point(1013, 309);
            panelLogin.Name = "panelLogin";
            panelLogin.Size = new Size(191, 59);
            panelLogin.TabIndex = 13;
            // 
            // btnRegistroTab
            // 
            btnRegistroTab.BackColor = SystemColors.ActiveBorder;
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
            // panelRegistro
            // 
            panelRegistro.BorderStyle = BorderStyle.FixedSingle;
            panelRegistro.Controls.Add(btnLoginTab);
            panelRegistro.Location = new Point(1201, 309);
            panelRegistro.Name = "panelRegistro";
            panelRegistro.Size = new Size(220, 59);
            panelRegistro.TabIndex = 14;
            // 
            // btnLoginTab
            // 
            btnLoginTab.Cursor = Cursors.Hand;
            btnLoginTab.FlatAppearance.BorderSize = 0;
            btnLoginTab.FlatStyle = FlatStyle.Flat;
            btnLoginTab.Location = new Point(20, 6);
            btnLoginTab.Name = "btnLoginTab";
            btnLoginTab.Size = new Size(175, 41);
            btnLoginTab.TabIndex = 0;
            btnLoginTab.Text = "Iniciar sesión";
            btnLoginTab.UseVisualStyleBackColor = true;
            btnLoginTab.Click += btnLoginTab_Click;
            // 
            // labelmenup
            // 
            labelmenup.AutoSize = true;
            labelmenup.Cursor = Cursors.Hand;
            labelmenup.Font = new Font("Segoe UI", 12F, FontStyle.Bold | FontStyle.Underline);
            labelmenup.Location = new Point(1569, 19);
            labelmenup.Name = "labelmenup";
            labelmenup.Size = new Size(169, 28);
            labelmenup.TabIndex = 15;
            labelmenup.Text = "<Menú principal";
            labelmenup.Click += labelmenup_Click;
            // 
            // pictureBox3
            // 
            pictureBox3.Image = (Image)resources.GetObject("pictureBox3.Image");
            pictureBox3.Location = new Point(955, 50);
            pictureBox3.Name = "pictureBox3";
            pictureBox3.Size = new Size(767, 224);
            pictureBox3.SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox3.TabIndex = 16;
            pictureBox3.TabStop = false;
            // 
            // frmRegistro
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            AutoScroll = true;
            ClientSize = new Size(1814, 1055);
            Controls.Add(pictureBox3);
            Controls.Add(labelmenup);
            Controls.Add(panelRegistro);
            Controls.Add(panel1);
            Controls.Add(pictureBox1);
            Controls.Add(panelLogin);
            Name = "frmRegistro";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Registro de Usuario";
            WindowState = FormWindowState.Maximized;
            Load += frmRegistro_Load;
            ((System.ComponentModel.ISupportInitialize)pictureBox1).EndInit();
            ((System.ComponentModel.ISupportInitialize)pictureBox2).EndInit();
            panel1.ResumeLayout(false);
            panel1.PerformLayout();
            panelLogin.ResumeLayout(false);
            panelRegistro.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)pictureBox3).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label label1;
        private TextBox txtUsuario;
        private TextBox txtPassword;
        private Label label2;
        private TextBox txtConPassword;
        private Label label3;
        private Button btnRegistrar;
        private TextBox txtNombre;
        private Label label4;
        private PictureBox pictureBox1;
        private PictureBox pictureBox2;
        private Panel panel1;
        private Panel panelLogin;
        private Panel panelRegistro;
        private Button btnRegistroTab;
        private Button btnLoginTab;
        private TextBox txtApellidos;
        private Label label5;
        private TextBox txtTelefono;
        private Label label7;
        private TextBox txtCorreo;
        private Label label6;
        private CheckBox chkTerminos;
        private ToolTip toolTip1;
        private Label labelmenup;
        private PictureBox pictureBox3;
    }
}
