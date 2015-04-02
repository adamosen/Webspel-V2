using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Webbspel.Startup))]
namespace Webbspel
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
