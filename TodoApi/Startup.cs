using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

namespace TodoApi
{
    public class Startup
    {
        private List<(string Scope, string Role)> ScopesWithRoles = new List<(string Scope, string Role)>(){
                (Scope: "read:todos", Role: "Reader"),
                (Scope: "add:todos", Role: "Creator"),
                (Scope: "edit:todos", Role: "Editor"),
                (Scope: "delete:todos", Role: "Deleter"),
            };

        public Startup(IWebHostEnvironment env, IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<TodoContext>(opt =>
               //opt.UseInMemoryDatabase("TodoList")
               opt.UseSqlServer(Configuration.GetConnectionString("TodoDatabase"))
               );

            services.AddControllers();

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Todo API", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme. \n\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \n\nExample: 'Bearer 12345abcdef'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
      {
        {
          new OpenApiSecurityScheme
          {
            Reference = new OpenApiReference
              {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
              },
              Scheme = "oauth2",
              Name = "Bearer",
              In = ParameterLocation.Header,

            },
            new List<string>(){ }
          }
        });
            });

            // Adding Authentication Services
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(options =>
            {
                options.Authority = $"https://{Configuration["Auth0:Domain"]}/";
                options.Audience = Configuration["Auth0:Audience"];

                // Roles comes from a custom claim added through a Rule in Auth0
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    RoleClaimType = "https://reacttodo.com/roles"
                };
            });

            // Adding Authorization scopes
            services.AddAuthorization(options =>
            {
                foreach (var scope in ScopesWithRoles)
                {
                    options.AddPolicy(scope.Scope, policy => policy.Requirements.Add(new HasScopeRequirement(scope.Scope,
            $"https://{Configuration["Auth0:Domain"]}/")));

                    options.AddPolicy(scope.Scope, policy =>
                       policy.RequireRole(scope.Role));
                }
            });

            // Register the scope authorization handler
            services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, TodoContext context)
        {
            // Make sure the database gets created...
            context.Database.EnsureCreated();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Todo API V1");
                c.RoutePrefix = string.Empty;
            });

            app.UseCors(builder => builder
                    .WithOrigins("*")
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            //.AllowCredentials());

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
