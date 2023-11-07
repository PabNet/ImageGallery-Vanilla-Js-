using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace ImageGalleryApplication_Vanilla_.Controllers
{
    [ApiController, Route("api/config")]
    public class ConfigController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ConfigController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetConfig()
        {
            var configData = new
            {
                apiUrl = _configuration["ApiUrl"],
                dataFileName = _configuration["DataFileName"],
                nameOfProvince = _configuration["NameOfProvince"],
                nameOfCity = _configuration["NameOfCity"],
                emailAddress = _configuration["EmailAddress"],
                merchantName = _configuration["MerchantName"]
            };

            return Ok(configData);
        }
    }
}