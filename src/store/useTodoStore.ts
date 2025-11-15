import { create } from 'zustand';
import { Todo } from '../schemas/todoSchema'; // Use the type defined by Zod

// --- AUTHENTICATION STATE ---

interface AuthUser {
    _id: string;
    email: string;
}

interface AuthState {
    token: string | null;
    user: AuthUser | null;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Initialize state from localStorage for persistence
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    
    login: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ token, user });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null });
    },
}));


// --- TODO LIST STATE ---

interface TodoState {
    todos: Todo[];
    setTodos: (todos: Todo[]) => void;
    addTodo: (todo: Todo) => void;
    updateTodo: (id: string, updatedFields: Partial<Todo>) => void;
    deleteTodo: (id: string) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
    todos: [],
    setTodos: (todos) => set({ todos }),
    addTodo: (todo) => set((state) => ({ todos: [todo, ...state.todos] })), // Add new todo to the top
    updateTodo: (id, updatedFields) => set((state) => ({
        todos: state.todos.map((todo) => 
            todo._id === id ? { ...todo, ...updatedFields } : todo
        ),
    })),
    deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter((todo) => todo._id !== id)
    })),
}));