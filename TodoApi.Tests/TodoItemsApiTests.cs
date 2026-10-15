using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TodoApi;
using TodoApi.Models;

public class TodoItemsApiTests
{
    [Fact]
    public async Task Create_UsesAuthenticatedOwnerAndPersistsNewTodoFields()
    {
        using var factory = new TodoApiFactory();
        using var client = factory.CreateClient();
        var requestStartedAt = DateTimeOffset.UtcNow;
        var response = await client.PostAsJsonAsync("/api/TodoItems", new
        {
            name = "Plan release",
            description = "Check migration and release notes",
            dueDate = (DateTime?)null,
            category = "Work",
            priority = 2,
            user = "attacker@example.com"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<TodoItem>();
        Assert.NotNull(created);
        Assert.Equal("alice@example.com", created.User);
        Assert.Equal("Check migration and release notes", created.Description);
        Assert.Equal("Work", created.Category);
        Assert.Null(created.DueDate);
        Assert.NotNull(created.CreatedOn);
        Assert.InRange(created.CreatedOn.Value, requestStartedAt, DateTimeOffset.UtcNow);
        Assert.Equal(TimeSpan.Zero, created.CreatedOn.Value.Offset);
        Assert.Null(created.DeletedOn);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TodoContext>();
        var saved = await db.TodoItems.SingleAsync();
        Assert.Equal("alice@example.com", saved.User);
    }

    [Fact]
    public async Task ReadAndMutations_AreRestrictedToAuthenticatedOwner()
    {
        using var factory = new TodoApiFactory();
        var id = await factory.AddTodo("alice@example.com", "Alice task");
        using var owner = factory.CreateClient();
        using var otherOwner = factory.CreateClient(new Dictionary<string, string> { ["X-Test-Email"] = "bob@example.com" });

        var list = await owner.GetFromJsonAsync<List<TodoItem>>("/api/TodoItems");
        Assert.NotNull(list);
        Assert.Single(list);
        Assert.Equal(HttpStatusCode.NotFound, (await otherOwner.GetAsync($"/api/TodoItems/{id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await otherOwner.PutAsJsonAsync($"/api/TodoItems/{id}", new
        {
            id, user = "bob@example.com", name = "Taken over", completed = true, priority = 1
        })).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await otherOwner.DeleteAsync($"/api/TodoItems/{id}")).StatusCode);

        var dueDate = DateTime.UtcNow.AddDays(2);
        var update = await owner.PutAsJsonAsync($"/api/TodoItems/{id}", new
        {
            id, user = "attacker@example.com", name = "Updated task", description = "Updated notes",
            completed = true, dueDate, category = "Personal", priority = 2
        });
        Assert.Equal(HttpStatusCode.NoContent, update.StatusCode);

        var saved = await owner.GetFromJsonAsync<TodoItem>($"/api/TodoItems/{id}");
        Assert.NotNull(saved);
        Assert.Equal("alice@example.com", saved.User);
        Assert.Equal("Updated task", saved.Name);
        Assert.Equal("Updated notes", saved.Description);
        Assert.Equal("Personal", saved.Category);
        Assert.True(saved.Completed);
        Assert.Equal(dueDate, saved.DueDate);
        Assert.Equal(1, await owner.GetFromJsonAsync<long>("/api/TodoItems/Count"));

        Assert.Equal(HttpStatusCode.OK, (await owner.DeleteAsync($"/api/TodoItems/{id}")).StatusCode);
        var remainingTodos = await owner.GetFromJsonAsync<List<TodoItem>>("/api/TodoItems");
        Assert.NotNull(remainingTodos);
        Assert.Empty(remainingTodos);
        Assert.Equal(HttpStatusCode.NotFound, (await owner.GetAsync($"/api/TodoItems/{id}")).StatusCode);
        Assert.Equal(0, await owner.GetFromJsonAsync<long>("/api/TodoItems/Count"));

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TodoContext>();
        var softDeleted = await db.TodoItems.IgnoreQueryFilters().SingleAsync(todo => todo.Id == id);
        Assert.NotNull(softDeleted.DeletedOn);
        Assert.Equal(TimeSpan.Zero, softDeleted.DeletedOn.Value.Offset);
    }

    [Theory]
    [InlineData("X-Test-Scopes", "read:todos")]
    [InlineData("X-Test-Roles", "Reader")]
    public async Task Create_RequiresBothScopeAndRole(string missingHeader, string suppliedValue)
    {
        using var factory = new TodoApiFactory();
        var headers = new Dictionary<string, string>();
        if (missingHeader == "X-Test-Scopes") headers[missingHeader] = suppliedValue;
        else headers[missingHeader] = suppliedValue;
        using var client = factory.CreateClient(headers);
        var response = await client.PostAsJsonAsync("/api/TodoItems", new { name = "Must be rejected" });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Create_ValidatesRequiredName()
    {
        using var factory = new TodoApiFactory();
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/TodoItems", new { name = "" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private sealed class TodoApiFactory : WebApplicationFactory<Program>
    {
        private readonly string _databaseName = Guid.NewGuid().ToString("N");

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll<DbContextOptions<TodoContext>>();
                foreach (var descriptor in services.Where(service =>
                    service.ServiceType.FullName?.Contains("IDbContextOptionsConfiguration") == true).ToList())
                    services.Remove(descriptor);
                services.AddDbContext<TodoContext>(options => options.UseInMemoryDatabase(_databaseName));
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = "Test";
                    options.DefaultChallengeScheme = "Test";
                    options.DefaultScheme = "Test";
                }).AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", _ => { });
            });
        }

        public HttpClient CreateClient(IDictionary<string, string>? headers = null)
        {
            var client = base.CreateClient();
            if (headers is not null)
                foreach (var header in headers) client.DefaultRequestHeaders.Add(header.Key, header.Value);
            return client;
        }

        public async Task<long> AddTodo(string user, string name)
        {
            using var scope = Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<TodoContext>();
            var item = new TodoItem { User = user, Name = name, Priority = TodoItem.PriorityEnum.Normal };
            db.TodoItems.Add(item);
            await db.SaveChangesAsync();
            return item.Id;
        }
    }

    private sealed class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public TestAuthHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger,
            UrlEncoder encoder) : base(options, logger, encoder) { }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var scopes = Request.Headers.TryGetValue("X-Test-Scopes", out var scopesHeader)
                ? scopesHeader.ToString() : "read:todos add:todos edit:todos delete:todos";
            var roles = Request.Headers.TryGetValue("X-Test-Roles", out var rolesHeader)
                ? rolesHeader.ToString().Split(' ', StringSplitOptions.RemoveEmptyEntries)
                : new[] { "Reader", "Creator", "Editor", "Deleter" };
            var email = Request.Headers.TryGetValue("X-Test-Email", out var emailHeader)
                ? emailHeader.ToString() : "alice@example.com";

            var claims = new List<Claim>
            {
                new("https://reacttodo.com/email", email),
                new("scope", scopes, ClaimValueTypes.String, "https://YourDomainHere.auth0.com/")
            };
            claims.AddRange(roles.Select(role => new Claim("https://reacttodo.com/roles", role)));
            var identity = new ClaimsIdentity(claims, Scheme.Name, ClaimTypes.Name, "https://reacttodo.com/roles");
            return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(identity), Scheme.Name)));
        }
    }
}
