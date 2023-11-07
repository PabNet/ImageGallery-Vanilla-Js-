using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ImageGalleryApplication_Vanilla_.Controllers
{
    [ApiController, Route("/")]
    public class ContactController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetMainPageAsync()
        {
            var filePath = "wwwroot/index.html";

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            return await Task.Run(() =>
            {
                var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                return new FileStreamResult(stream, "text/html");
            });
        }

    }
}