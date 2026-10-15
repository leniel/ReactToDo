using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly TodoContext _context;

        public TodoItemsController(TodoContext context)
        {
            _context = context;
        }

        // GET: api/TodoItems
        [HttpGet]
        [Route("")]
        [Authorize("read:todos", Roles="Reader")]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
        {
            var user = GetCurrentUserEmail();
            if (user == null) return Forbid();

            return await _context.TodoItems.Where(todo => todo.User == user).ToListAsync();
        }

        [HttpGet]
        [Route("Count")]
        [Authorize("read:todos", Roles = "Reader")]
        public async Task<ActionResult<long>> GetTodoItemsCount()
        {
            var user = GetCurrentUserEmail();
            if (user == null) return Forbid();

            return await _context.TodoItems.LongCountAsync(todo => todo.User == user);
        }

        // GET: api/TodoItems/5
        [HttpGet("{id}")]
        [Authorize("read:todos", Roles = "Reader")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(long id)
        {
            var user = GetCurrentUserEmail();
            if (user == null) return Forbid();

            var todoItem = await _context.TodoItems
                .FirstOrDefaultAsync(todo => todo.Id == id && todo.User == user);

            if (todoItem == null)
            {
                return NotFound();
            }

            return todoItem;
        }

        // PUT: api/TodoItems/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        [Authorize("edit:todos", Roles = "Editor")]
        public async Task<IActionResult> PutTodoItem(long id, TodoItem todoItem)
        {
            if (id != todoItem.Id)
            {
                return BadRequest();
            }

            var user = GetCurrentUserEmail();
            if (user == null) return Forbid();

            var existingTodo = await _context.TodoItems
                .FirstOrDefaultAsync(todo => todo.Id == id && todo.User == user);
            if (existingTodo == null) return NotFound();

            existingTodo.Name = todoItem.Name;
            existingTodo.Description = todoItem.Description;
            existingTodo.Completed = todoItem.Completed;
            existingTodo.DueDate = todoItem.DueDate;
            existingTodo.Priority = todoItem.Priority;
            existingTodo.Category = todoItem.Category;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        // POST: api/TodoItems
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        [Authorize("add:todos", Roles = "Creator")]
        public async Task<ActionResult<TodoItem>> PostTodoItem([FromBody]CreateTodoItemRequest request)
        {
            var user = GetCurrentUserEmail();
            if (user == null) return Forbid();

            var todoItem = new TodoItem
            {
                User = user,
                Name = request.Name,
                Description = request.Description,
                DueDate = request.DueDate,
                CreatedOn = DateTimeOffset.UtcNow,
                Priority = request.Priority,
                Category = request.Category
            };

            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();

            //await Task.Delay(10000);

            return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
        }

        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        [Authorize("delete:todos", Roles = "Deleter")]
        public async Task<ActionResult<TodoItem>> DeleteTodoItem(long id)
        {
            var user = GetCurrentUserEmail();
            if (user == null) return Forbid();

            var todoItem = await _context.TodoItems
                .FirstOrDefaultAsync(todo => todo.Id == id && todo.User == user);
            if (todoItem == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();

            return todoItem;
        }

        private string GetCurrentUserEmail()
        {
            return User.FindFirst("https://reacttodo.com/email")?.Value;
        }
    }
}
