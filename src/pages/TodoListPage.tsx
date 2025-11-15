import React, { useEffect } from 'react';
import InputField from '../components/InputField'; // <-- Component Import
import TodoList from '../components/TodoList'; // <-- Component Import
import AppFooter from '../components/AppFooter'; // <-- Component Import
import { useAuthStore, useTodoStore } from '../store/useTodoStore'; // <-- Zustand Store Imports
import { useTodoApi } from '../hooks/useTodoApi'; // <-- React Query Hook Import
import { useNavigate } from 'react-router-dom';
import { DragDropContext, DropResult } from 'react-beautiful-dnd'; // <-- dnd Imports

const TodoListPage: React.FC = () => {
    const navigate = useNavigate();
    
    // --- Hook and State Access (DEFINITIONS FOR ALL MISSING NAMES) ---
    const token = useAuthStore((state) => state.token); // Resolves 'Cannot find name token'
    const logout = useAuthStore((state) => state.logout); // Resolves 'Cannot find name logout'
    const { todosQuery } = useTodoApi(); // Resolves 'Cannot find name todosQuery'
    const allTodos = useTodoStore((state) => state.todos); // Resolves 'Cannot find name allTodos'

    // Placeholder function required by DragDropContext (Resolves 'Cannot find name onDragEnd')
    const onDragEnd = (result: DropResult) => {
        console.log('Drag ended:', result);
    };

    // Redirect to login if unauthenticated
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    if (!token) {
        return <div>Redirecting to login...</div>;
    }

    // Separate active and completed todos (Resolves 'Cannot find name activeTodos/completedTodos')
    const activeTodos = allTodos.filter(todo => !todo.isDone);
    const completedTodos = allTodos.filter(todo => todo.isDone);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            
            {/* 1. TOP RIGHT LOGOUT BUTTON (Sequential flow fix applied in App.css) */}
            <div className="header-container">
                <button onClick={logout} className="logout-button">
                    Logout
                </button>
            </div>
            
            {/* 2. Main Content Area */}
            <div style={{ padding: '20px', width: '95%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                <InputField />
                
                {/* Check and display loading/error states using todosQuery */}
                {todosQuery.isLoading && <div>Fetching todos...</div>}
                {todosQuery.isError && <div>Error fetching todos. Try logging out and back in.</div>}

                {todosQuery.isSuccess && (
                    <TodoList
                        todos={activeTodos} 
                        setTodos={() => { /* Dummy function */ }}
                        CompletedTodos={completedTodos}
                        setCompletedTodos={() => { /* Dummy function */ }}
                    />
                )}
            </div>
            
            {/* 3. FOOTER (Flows after Todo Lists) */}
            <AppFooter /> 

        </DragDropContext>
    );
};

export default TodoListPage;