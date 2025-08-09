import React, { useState, useEffect } from "react";
import RelationshipTimeline from "../components/RelationshipTimeline";
import ExploreBar from "../components/ExploreBar";
import ExploreGrid from "../components/ExploreGrid";
import ExploreModal from "../components/ExploreModal";
import TodoListView from "../components/TodoListView";
import Toast from "../components/Toast";
import { usePublicEvents } from "../hooks/usePublicEvents";
import { useTodoList } from "../hooks/useTodoList";
import { eventsApi, relationshipsApi } from "../lib/api";

function Us() {
  const [events, setEvents] = useState([]);
  
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
    console.log("Events updated:", newEvents);
  };

  // Load events from backend on mount (if relationship exists)
  useEffect(() => {
    const load = async () => {
      try {
        await relationshipsApi.getCurrent(); // ensure relationship exists
        const list = await eventsApi.listMine({ limit: 100, offset: 0 });
        const mapped = list.map(ev => ({
          id: ev.id,
          date: ev.date?.split('T')[0],
          type: ev.type,
          title: ev.title,
          imageUrl: ev.image?.url || "",
        }));
        setEvents(mapped);
      } catch (e) {
        setEvents([]); // no relationship or error -> empty
        console.log('Events load skipped:', e?.response?.data?.message || e.message);
      }
    };
    load();
  }, []);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Create event handler used by RelationshipTimeline modal
  const handleCreateEventFromTimeline = async (eventData) => {
    const payload = {
      title: eventData.title,
      description: eventData.description,
      date: eventData.date ? new Date(eventData.date).toISOString() : new Date().toISOString(),
      type: eventData.type || 'DATE',
    };
    const created = await eventsApi.create(payload);
    const mapped = {
      id: created.id,
      date: created.date?.split('T')[0],
      type: created.type,
      title: created.title,
      imageUrl: created.image?.url || "",
    };
    setEvents(prev => [...prev, mapped]);
    showToastMessage('Event created successfully');
  };

  // Update event handler used by RelationshipTimeline modal in edit mode
  const handleUpdateEventFromTimeline = async (eventData) => {
    const payload = {
      title: eventData.title,
      description: eventData.description,
      date: eventData.date ? new Date(eventData.date).toISOString() : undefined,
      type: eventData.type,
    };
    const updated = await eventsApi.updateById(eventData.id, payload);
    const mapped = {
      id: updated.id,
      date: updated.date?.split('T')[0],
      type: updated.type,
      title: updated.title,
      imageUrl: updated.image?.url || "",
    };
    setEvents(prev => prev.map(e => e.id === mapped.id ? mapped : e));
    showToastMessage('Event updated successfully');
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
      {/* Explore Bar */}
      {/* <ExploreBar
        publicEvents={publicEvents}
        todoCount={todoList.length}
        onShowExploreGrid={handleShowExploreGrid}
        onShowTodoList={handleShowTodoList}
      /> */}

      <div className="flex-1 overflow-y-auto">
        <RelationshipTimeline 
          events={events} 
          onEventsChange={handleEventsChange}
          onTogglePublic={handleTogglePublic}
          showToast={showToastMessage}
          onCreateEvent={handleCreateEventFromTimeline}
          onUpdateEvent={handleUpdateEventFromTimeline}
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