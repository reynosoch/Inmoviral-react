using System;
using System.Windows.Forms; // Asegúrate de tener este using

namespace Inmoviral3._0
{
    internal static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            // --- CORRECCIÓN: Inicialización manual ---
            // En lugar de ApplicationConfiguration.Initialize(), usamos estas dos líneas:
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            // -----------------------------------------

            // Arrancar con el Splash Screen
            Application.Run(new frmSplash());
        }
    }
}