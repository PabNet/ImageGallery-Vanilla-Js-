using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ImageGalleryApplication_Vanilla_.Controllers
{
    [ApiController, Route("api/file")]
    public class FileController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetImageAsync([FromQuery] string url)
        {
            using var httpClient = new HttpClient();
            try
            {
                var response = await httpClient.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsByteArrayAsync();
                    var contentType = response.Content.Headers.ContentType?.MediaType ?? "application/octet-stream";

                    return File(content, contentType);
                }

                return BadRequest($"Failed to download image by {url}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}