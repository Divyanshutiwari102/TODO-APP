import React from "react";
import "./styles.css"; // Ensure you have styles.css in src/components
import { useForm, SubmitHandler } from "react-hook-form"; 
import { useTodoApi } from "../hooks/useTodoApi"; // Correct path

interface FormInput {
  todo: string;
}

const InputField: React.FC = () => {
  // Initialize RHF and get the create mutation hook
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const { createTodoMutation } = useTodoApi(); 

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    // Check for empty input to prevent API call
    if (!data.todo.trim()) return;

    // Call the API mutation
    createTodoMutation.mutate(data.todo.trim(), {
        onSuccess: () => {
            // Clear the input after successful submission
            reset({ todo: '' });
        },
        onError: (error) => {
            console.error('Failed to create todo:', error);
            // In a real app, show a toast notification here
        }
    });
  };

  return (
    <form className="input" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Enter a Task"
        // Register the field with RHF
        {...register("todo", { required: true, minLength: 1 })} 
        className="input__box"
      />
      <button 
        type="submit" 
        className="input_submit"
        disabled={createTodoMutation.isPending} // Disable while submitting
      >
        GO
      </button>
    </form>
  );
};

export default InputField;