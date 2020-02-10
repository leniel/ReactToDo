using System;
using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models
{
    public class TodoItem
    {
        public long Id { get; set; }

        [Required]
        public string User { get; set; }

        [Required]
        public string Name { get; set; }

        public bool Completed { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        public PriorityEnum Priority { get; set; }

        public enum PriorityEnum
        {
            Low = 0, Normal, High
        }
    }
}