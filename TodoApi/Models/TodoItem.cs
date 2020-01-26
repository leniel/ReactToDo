using System;

namespace TodoApi.Models
{
    public class TodoItem
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public bool Completed { get; set; }

        public DateTime DueDate { get; set; }

        public PriorityEnum Priority { get; set; }

        public enum PriorityEnum
        {
            Low = 0, Normal, High
        }
    }
}