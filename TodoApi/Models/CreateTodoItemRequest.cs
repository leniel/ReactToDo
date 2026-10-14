using System;
using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models
{
    public class CreateTodoItemRequest
    {
        [Required]
        [StringLength(30)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public DateTime? DueDate { get; set; }

        [StringLength(50)]
        public string Category { get; set; }

        [EnumDataType(typeof(TodoItem.PriorityEnum))]
        public TodoItem.PriorityEnum Priority { get; set; }
    }
}
