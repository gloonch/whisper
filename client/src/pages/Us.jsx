import React, { useState } from "react";
import RelationshipTimeline from "../components/RelationshipTimeline";
import ExploreBar from "../components/ExploreBar";
import ExploreGrid from "../components/ExploreGrid";
import ExploreModal from "../components/ExploreModal";
import TodoListView from "../components/TodoListView";
import Toast from "../components/Toast";
import { usePublicEvents } from "../hooks/usePublicEvents";
import { useTodoList } from "../hooks/useTodoList";

const initialEvents = [
  {
    id: "1",
    date: "2021-01-01",
    type: "MEETING",
    title: "First Meeting",
    imageUrl: "",
  },
  {
    id: "2",
    date: "2021-03-14",
    type: "TRIP",
    title: "Spring Trip",
    imageUrl: "",
  },
  {
    id: "3",
    date: "2021-06-21",
    type: "BIRTHDAY",
    title: "Birthday Surprise",
    imageUrl: "",
  },
  {
    id: "4",
    date: "2022-02-14",
    type: "ANNIVERSARY",
    title: "1st Anniversary",
    imageUrl: "",
  },
  {
    id: "5",
    date: "2022-07-10",
    type: "FIGHT_MAKEUP",
    title: "Big Fight & Makeup",
    imageUrl: "",
  },
];

function Us() {
  const [events, setEvents] = useState(initialEvents);
  
  // Explore & Todo hooks
  const { publicEvents, addToPublicEvents, removeFromPublicEvents } = usePublicEvents();
  const { todoList, addToTodoList, completeTodo } = useTodoList();
  
  // UI State
  const [showExploreGrid, setShowExploreGrid] = useState(false);
  const [showTodoList, setShowTodoList] = useState(false);
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [selectedExploreEvent, setSelectedExploreEvent] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleEventsChange = (newEvents) => {
    setEvents(newEvents);
    // در آینده: ذخیره در Firebase
    console.log("Events updated:", newEvents);
  };

  // Toast functionality
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Explore functionality
  const handleShowExploreGrid = () => {
    setShowExploreGrid(true);
  };

  const handleCloseExploreGrid = () => {
    setShowExploreGrid(false);
  };

  const handleExploreEventClick = (event) => {
    setSelectedExploreEvent(event);
    setShowExploreModal(true);
  };

  const handleCloseExploreModal = () => {
    setShowExploreModal(false);
    setSelectedExploreEvent(null);
  };

  const handleAddToTodo = (event) => {
    addToTodoList(event);
    showToastMessage(`"${event.title}" added to your to-do list!`);
  };

  // Todo functionality
  const handleShowTodoList = () => {
    setShowTodoList(true);
  };

  const handleCloseTodoList = () => {
    setShowTodoList(false);
  };

  const handleTodoComplete = (todo, imageUrl) => {
    // حذف از todo list
    completeTodo(todo.id);
    
    // اضافه کردن به timeline
    const newEvent = {
      id: `todo_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'TODO_COMPLETED',
      title: todo.title,
      imageUrl: imageUrl,
      isPublic: false
    };
    
    const updatedEvents = [...events, newEvent];
    handleEventsChange(updatedEvents);
    
    showToastMessage(`"${todo.title}" completed and added to timeline!`);
  };

  // Timeline public/private toggle
  const handleTogglePublic = (event) => {
    const updatedEvents = events.map(e => {
      if (e.id === event.id) {
        const updatedEvent = { ...e, isPublic: !e.isPublic };
        
        // اضافه یا حذف از publicEvents
        if (updatedEvent.isPublic) {
          addToPublicEvents(updatedEvent);
        } else {
          removeFromPublicEvents(`pe_${event.id}`);
        }
        
        return updatedEvent;
      }
      return e;
    });
    
    handleEventsChange(updatedEvents);
  };

  return (
    <div className="flex flex-col h-full bg-bg-deep">
      {/* <div className="px-4 py-6 border-b border-white/10">
        <h1 className="text-2xl font-semibold text-white mb-2">Our Story</h1>
        <p className="text-white/70 text-sm">Timeline of our beautiful journey together</p>
      </div> */}
      
      {/* Explore Bar */}
      <ExploreBar
        publicEvents={publicEvents}
        todoCount={todoList.length}
        onShowExploreGrid={handleShowExploreGrid}
        onShowTodoList={handleShowTodoList}
      />
      
      <div className="flex-1 overflow-y-auto">
        <RelationshipTimeline 
          events={events} 
          onEventsChange={handleEventsChange}
          onTogglePublic={handleTogglePublic}
          showToast={showToastMessage}
        />
      </div>

      {/* Explore Grid */}
      <ExploreGrid
        isVisible={showExploreGrid}
        publicEvents={publicEvents}
        onClose={handleCloseExploreGrid}
        onEventClick={handleExploreEventClick}
      />

      {/* Explore Modal */}
      <ExploreModal
        isVisible={showExploreModal}
        event={selectedExploreEvent}
        onClose={handleCloseExploreModal}
        onAddToTodo={handleAddToTodo}
      />

      {/* Todo List */}
      <TodoListView
        isVisible={showTodoList}
        todoList={todoList}
        onClose={handleCloseTodoList}
        onTodoComplete={handleTodoComplete}
      />

      {/* Toast */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Us; 