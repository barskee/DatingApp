using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using API.Helpers;
using API.SignalR;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddSingleton<PresenceTracker>(); 
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<IPhotoService, PhotoService>(); 
            services.AddScoped<ITokenService, TokenService>(); 
            services.AddScoped<IUnitOfWork, UnitOfWork>(); 
            services.AddScoped<LogUsersActivity>(); 
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly); 
            
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            return services; 
        }
    }
}