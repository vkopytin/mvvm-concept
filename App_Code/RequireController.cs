using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Ajax;
using System.Reflection;
using System.Web.Optimization;

namespace hellomvc.Controllers
{
    public class RequireController : Controller
    {
        //public IEnumerable<Product> GetAllProducts()
        //{
        //    return products;
        //}

        [HttpGet]
        public ActionResult Config(int id)
        {
            return Json(new {
                name = Scripts.Url("~/Scripts/jquery")
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
