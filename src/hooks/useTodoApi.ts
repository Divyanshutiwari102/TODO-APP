import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoListSchema, todoSchema, Todo } from '../schemas/todoSchema';
import { useAuthStore, useTodoStore } from '../store/useTodoStore';
import { useEffect } from 'react'; // <-- NEW IMPORT: Required for side effects in v5

const API_BASE_URL = 'http://localhost:5000/api'; 

// Axios instance with JWT interceptor
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- API FUNCTIONS ---
const fetchTodos = async (): Promise<Todo[]> => {
    const { data } = await api.get('/todos');
    // Validate data against Zod schema
    return todoListSchema.parse(data); 
};

const createTodo = async (todo: string): Promise<Todo> => {
    const { data } = await api.post('/todos', { todo });
    return todoSchema.parse(data);
};

const updateTodoText = async (todoId: string, todo: string): Promise<Todo> => {
    const { data } = await api.put(`/todos/${todoId}`, { todo });
    return todoSchema.parse(data);
};

const toggleTodoComplete = async (todoId: string, isDone: boolean): Promise<Todo> => {
    const { data } = await api.put(`/todos/${todoId}/complete`, { isDone });
    return todoSchema.parse(data);
};

const deleteTodo = async (todoId: string) => {
    await api.delete(`/todos/${todoId}`);
};

// --- REACT QUERY HOOK ---
export const useTodoApi = () => {
    const queryClient = useQueryClient();
    const { updateTodo, deleteTodo: removeTodoFromStore } = useTodoStore();
    const token = useAuthStore((state) => state.token);
    const setTodos = useTodoStore((state) => state.setTodos); // Get setTodos action

    // 1. Fetch Todos Query (Fixed: Removed onSuccess from query options)
    const todosQuery = useQuery<Todo[]>({
        queryKey: ['todos'],
        queryFn: fetchTodos,
        staleTime: 5 * 60 * 1000, 
        enabled: !!token, 
        // REMOVED: onSuccess: (data) => useTodoStore.getState().setTodos(data),
    });
    
    // FIX: Use useEffect to handle the side effect (Zustand update)
    useEffect(() => {
        if (todosQuery.isSuccess && todosQuery.data) {
            setTodos(todosQuery.data);
        }
    }, [todosQuery.isSuccess, todosQuery.data, setTodos]);


    // 2. Create Todo Mutation
    const createTodoMutation = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    // 3. Update Todo Text Mutation (optimistic update)
    const updateTodoMutation = useMutation({
        mutationFn: ({ todoId, todo }: { todoId: string; todo: string }) => updateTodoText(todoId, todo),
        onMutate: async ({ todoId, todo }) => {
            updateTodo(todoId, { todo });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
    
    // 4. Toggle Complete Mutation (optimistic update)
    const toggleCompleteMutation = useMutation({
        mutationFn: ({ todoId, isDone }: { todoId: string; isDone: boolean }) => toggleTodoComplete(todoId, isDone),
        onMutate: async ({ todoId, isDone }) => {
            updateTodo(todoId, { isDone });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    // 5. Delete Todo Mutation (optimistic update)
    const deleteTodoMutation = useMutation({
        mutationFn: deleteTodo,
        onMutate: async (todoId) => {
            removeTodoFromStore(todoId);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    return { 
        todosQuery, 
        createTodoMutation, 
        updateTodoMutation, 
        toggleCompleteMutation, 
        deleteTodoMutation 
    };
};