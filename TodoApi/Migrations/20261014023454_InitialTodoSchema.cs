using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialTodoSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID(N'[dbo].[TodoItems]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[TodoItems]
    (
        [Id] bigint IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [User] nvarchar(max) NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [Completed] bit NOT NULL,
        [DueDate] datetime2 NULL,
        [Category] nvarchar(max) NULL,
        [Priority] int NOT NULL
    );
END
ELSE
BEGIN
    IF COL_LENGTH(N'dbo.TodoItems', N'Description') IS NULL
        ALTER TABLE [dbo].[TodoItems] ADD [Description] nvarchar(max) NULL;

    IF COL_LENGTH(N'dbo.TodoItems', N'Category') IS NULL
        ALTER TABLE [dbo].[TodoItems] ADD [Category] nvarchar(max) NULL;

    IF EXISTS (
        SELECT 1
        FROM sys.columns
        WHERE object_id = OBJECT_ID(N'[dbo].[TodoItems]')
          AND name = N'DueDate'
          AND is_nullable = 0
    )
        ALTER TABLE [dbo].[TodoItems] ALTER COLUMN [DueDate] datetime2 NULL;
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // This migration also baselines databases originally created with EnsureCreated.
            // Keep the existing TodoItems table and data if this migration is rolled back.
        }
    }
}
