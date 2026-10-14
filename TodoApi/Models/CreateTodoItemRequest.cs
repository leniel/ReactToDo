using System;
using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models
{
    public class CreateTodoItemRequest
    {
        [Required]
        [StringLength(30)]
        public string Name { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [EnumDataType(typeof(TodoItem.PriorityEnum))]
        public TodoItem.PriorityEnum Priority { get; set; }
    }
}
