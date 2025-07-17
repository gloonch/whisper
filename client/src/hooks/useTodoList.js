import { useState } from 'react';

export function useTodoList() {
  const [todoList, setTodoList] = useState([
    { id: 't1', title: 'Plan desert camping' },
    { id: 't2', title: 'Try cooking together' },
    { id: 't3', title: 'Visit art gallery' }
  ]);

  const addToTodoList = (event) => {
    const newTodo = {
      id: `todo_${Date.now()}`,
      title: event.title,
      sourceEventId: event.id
    };
    setTodoList(prev => [...prev, newTodo]);
  };

  const removeFromTodoList = (todoId) => {
    setTodoList(prev => prev.filter(todo => todo.id !== todoId));
  };

  const completeTodo = (todoId) => {
    // حذف از todoList و برگرداندن آیتم برای اضافه کردن به timeline
    const todo = todoList.find(t => t.id === todoId);
    if (todo) {
      removeFromTodoList(todoId);
      return todo;
    }
    return null;
  };

  return {
    todoList,
    addToTodoList,
    removeFromTodoList,
    completeTodo
  };
} 