using System.Web;
using System.Web.Optimization;

namespace hellomvc
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = false;

            bundles.Add(new ScriptBundle("~/js/libs").Include(
                "~/Scripts/libs/jquery-1.11.3.js")
            );

            bundles.Add(new ScriptBundle("~/js/main").Include(
                "~/Scripts/app/main.js")
            );

        }
    }
}
