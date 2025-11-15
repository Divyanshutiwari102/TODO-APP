import { z } from 'zod';

// Schema for a single Todo item from the API
export const todoSchema = z.object({
    _id: z.string().min(1, "ID is required"),
    todo: z.string().min(1, "Task description is required"),
    isDone: z.boolean(),
    user: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// Schema for the list of Todos returned from the API
export const todoListSchema = z.array(todoSchema);

// Schema for creating or updating a todo (input validation)
export const todoInputSchema = z.object({
    todo: z.string().min(1, "Task description cannot be empty"),
    isDone: z.boolean().optional(),
});

export type Todo = z.infer<typeof todoSchema>;
export type TodoInput = z.infer<typeof todoInputSchema>;