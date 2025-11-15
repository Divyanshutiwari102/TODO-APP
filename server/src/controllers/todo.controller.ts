import { Request, Response, NextFunction } from 'express';
import Todo from '../models/Todo.model';
import { CustomError } from '../middleware/error-handler';
import { IUser } from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware'; // Use the extended Request type

// @route POST /api/todos (MANDATORY REQUIREMENT)
export const createTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { todo } = req.body;
        if (!todo) {
            return next(new CustomError('Please provide todo content', 400));
        }

        const newTodo = await Todo.create({
            user: req.user!._id, // User is guaranteed by 'protect' middleware
            todo,
            isDone: false,
        });

        res.status(201).json(newTodo);
    } catch (error) {
        next(error);
    }
};

// @route GET /api/todos (MANDATORY REQUIREMENT)
export const listTodos = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const todos = await Todo.find({ user: req.user!._id }).sort({ createdAt: 1 });
        res.json(todos);
    } catch (error) {
        next(error);
    }
};

// @route PUT /api/todos/:id (MANDATORY REQUIREMENT)
export const updateTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const todoId = req.params.id;
        const { todo } = req.body;

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, user: req.user!._id }, 
            { todo },
            { new: true } 
        );

        if (!updatedTodo) {
            return next(new CustomError('Todo not found or user not authorized', 404));
        }

        res.json(updatedTodo);
    } catch (error) {
        next(error);
    }
};

// @route PUT /api/todos/:id/complete (MANDATORY REQUIREMENT)
export const toggleTodoComplete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const todoId = req.params.id;
        const { isDone } = req.body; 

        if (typeof isDone !== 'boolean') {
             return next(new CustomError('Invalid value for isDone', 400));
        }

        const toggledTodo = await Todo.findOneAndUpdate(
            { _id: todoId, user: req.user!._id },
            { isDone },
            { new: true }
        );

        if (!toggledTodo) {
            return next(new CustomError('Todo not found or user not authorized', 404));
        }

        res.json(toggledTodo);
    } catch (error) {
        next(error);
    }
};

// @route DELETE /api/todos/:id (MANDATORY REQUIREMENT)
export const deleteTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const todoId = req.params.id;

        const result = await Todo.findOneAndDelete({ _id: todoId, user: req.user!._id });

        if (!result) {
            return next(new CustomError('Todo not found or user not authorized', 404));
        }

        res.json({ message: 'Todo removed' });
    } catch (error) {
        next(error);
    }
};