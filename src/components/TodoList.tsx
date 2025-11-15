import React from "react";
// Import Todo type directly from schemas for cleaner typing
import { Todo } from "../schemas/todoSchema"; 
import SingleTodo from "./SingleTodo";
// Components required for the drag-and-drop feature
import { Droppable, DropResult } from "react-beautiful-dnd"; 
import "./styles.css"; // Ensure styles are imported

interface props {
  // Active Todos (Read from Zustand, filtered in TodoListPage)
  todos: Array<Todo>; 
  // Completed Todos (Read from Zustand, filtered in TodoListPage)
  CompletedTodos: Array<Todo>; 
  
  // These props are vestigial from the original stateful component, 
  // but we keep them to satisfy interface checks if other files haven't been cleaned up.
  setTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>; 
  setCompletedTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>; 
}

const TodoList: React.FC<props> = ({
  todos,
  CompletedTodos,
}) => {
  return (
    <div className="container">
      
      {/* 1. Active Tasks Column */}
      <Droppable droppableId="TodosList">
        {(provided, snapshot) => (
          <div
            className={`todos ${snapshot.isDraggingOver ? "dragactive" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="todos__heading">Active Tasks</span>
            {todos?.map((todo, index) => (
              <SingleTodo
                index={index}
                todo={todo}
                key={todo._id} // Use MongoDB _id
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      {/* 2. Completed Tasks Column */}
      <Droppable droppableId="TodosRemove">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`todos  ${
              snapshot.isDraggingOver ? "dragcomplete" : "remove"
            }`}
          >
            <span className="todos__heading">Completed Tasks</span>
            {CompletedTodos?.map((todo, index) => (
              <SingleTodo
                index={index}
                todo={todo}
                key={todo._id} // Use MongoDB _id
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TodoList;