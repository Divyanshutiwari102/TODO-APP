import express from 'express';
import { 
    createTodo, 
    listTodos, 
    updateTodo, 
    toggleTodoComplete, 
    deleteTodo 
} from '../controllers/todo.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All Todo routes MUST be protected by JWT middleware
router.route('/')
    .post(protect, createTodo) 
    .get(protect, listTodos);  

router.route('/:id')
    .put(protect, updateTodo)    
    .delete(protect, deleteTodo); 

router.route('/:id/complete')
    .put(protect, toggleTodoComplete); // Mark as Completed/Not Completed

export default router;