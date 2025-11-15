import React, { useEffect, useState, useRef } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";
//import { Todo } from "../store/useTodoStore"; // Use the new Todo type
import { useTodoApi } from "../hooks/useTodoApi"; // Use the API hook
import { useForm, SubmitHandler } from "react-hook-form"; // Use React Hook Form
import { Todo } from "../schemas/todoSchema";
interface FormInput {
    editTodo: string;
}

const SingleTodo: React.FC<{
  index: number;
  todo: Todo;
}> = ({ index, todo }) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { toggleCompleteMutation, deleteTodoMutation, updateTodoMutation } = useTodoApi();
    
    // Initialize React Hook Form with the current todo text
    const { register, handleSubmit, setValue } = useForm<FormInput>({
        defaultValues: { editTodo: todo.todo },
    });

    useEffect(() => {
        if (editMode) {
            inputRef.current?.focus();
        }
        // Sync form value when todo prop updates externally (e.g., after a successful mutation)
        setValue('editTodo', todo.todo);
    }, [editMode, todo.todo, setValue]);


    // Handle the update submission using React Hook Form
    const handleEditSubmit: SubmitHandler<FormInput> = (data) => {
        if (data.editTodo.trim() === todo.todo || !editMode) {
            setEditMode(false);
            return;
        }

        // Call the React Query mutation to update the API
        updateTodoMutation.mutate({ 
            todoId: todo._id, 
            todo: data.editTodo.trim() 
        }, {
            onSuccess: () => {
                setEditMode(false); // Exit edit mode on success
            },
            onError: (error) => {
                console.error("Update failed:", error);
                // Handle error notification
            }
        });
    };

    // Handle Delete
    const handleDelete = () => {
        deleteTodoMutation.mutate(todo._id);
    };

    // Handle Mark as Completed/Not Completed
    const handleDone = () => {
        toggleCompleteMutation.mutate({ 
            todoId: todo._id, 
            isDone: !todo.isDone 
        });
    };

    return (
        <Draggable draggableId={todo._id} index={index}>
            {(provided, snapshot) => (
                <form
                    onSubmit={handleSubmit(handleEditSubmit)}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className={`todos__single ${snapshot.isDragging ? "drag" : ""}`}
                >
                    {editMode ? (
                        <input
                            // Use register from RHF
                            {...register("editTodo", { required: true })} 
                            className="todos__single--text"
                            ref={inputRef}
                        />
                    ) : todo.isDone ? (
                        <s className="todos__single--text">{todo.todo}</s>
                    ) : (
                        <span className="todos__single--text">{todo.todo}</span>
                    )}
                    <div>
                        <span
                            className="icon"
                            onClick={() => {
                                if (!editMode && !todo.isDone) {
                                    setEditMode(true);
                                }
                            }}
                        >
                            <AiFillEdit />
                        </span>
                        <span className="icon" onClick={handleDelete}>
                            <AiFillDelete />
                        </span>
                        <span className="icon" onClick={handleDone}>
                            <MdDone />
                        </span>
                    </div>
                </form>
            )}
        </Draggable>
    );
};

export default SingleTodo;