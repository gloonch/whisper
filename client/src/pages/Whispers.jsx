import React, { useState } from "react";
import DateSelector from "../components/DateSelector";
import MemoryEvents from "../components/MemoryEvents";
import WhispersList from "../components/WhispersList";
import WhisperModal from "../components/WhisperModal";
import { createWhisperData } from "../components/WhisperTypes";
import { eventsApi, relationshipsApi, whispersApi } from "../lib/api";
import { useNavigate } from "react-router-dom";
import WhisperConvertModal from "../components/WhisperConvertModal";

function Whispers() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [whisperModalOpen, setWhisperModalOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [whisperToConvert, setWhisperToConvert] = useState(null);
  const [events, setEvents] = useState([]);
  const [whispers, setWhispers] = useState([]);
  const navigate = useNavigate();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Whisper handlers
  const handleAddWhisper = () => {
    setWhisperModalOpen(true);
  };

  const handleSaveWhisper = async (whisperData) => {
    try {
      const payload = {
        type: whisperData.type,
        text: whisperData.type === 'custom' ? whisperData.text : whisperData.text,
        recurrence: whisperData.recurrence,
        date: new Date(whisperData.date).toISOString()
      };
      const created = await whispersApi.create(payload);
      const mapped = {
        id: created.id,
        date: created.date?.split('T')[0],
        type: created.type,
        text: created.text,
        recurrence: created.recurrence,
        isDone: created.isDone || false
      };
      setWhispers(prev => [...prev, mapped]);
    } catch (e) {
      console.log('Whisper create failed:', e?.response?.data?.message || e.message);
    }
  };

  // No mark-done state any more

  const handleConvertWhisperToEvent = (whisper) => {
    setWhisperToConvert(whisper);
    setConvertModalOpen(true);
  };

  const handleDeleteWhisper = async (whisperId) => {
    try {
      await whispersApi.delete(whisperId);
      setWhispers(prev => prev.filter(w => w.id !== whisperId));
    } catch (e) {
      console.log('Whisper delete failed:', e?.response?.data?.message || e.message);
    }
  };

  // فیلتر کردن eventهای مربوط به روز انتخاب شده (در همه سال‌ها)
  const getEventsForSelectedDay = () => {
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === selectedMonth && 
             eventDate.getDate() === selectedDay;
    });
  };

  // Initialize with today's date
  React.useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
  }, []);

  // Load events from backend on mount (if relationship exists)
  React.useEffect(() => {
    const load = async () => {
      try {
        await relationshipsApi.getCurrent();
        const list = await eventsApi.listMine({ limit: 100, offset: 0 });
        const mapped = list.map(ev => ({
          id: ev.id,
          date: ev.date?.split('T')[0],
          type: ev.type,
          title: ev.title,
          imageUrl: ev.image?.url || "",
        }));
        setEvents(mapped);
        // load whispers
        const whispersList = await whispersApi.listMine({ limit: 200, offset: 0 });
        const mappedWhispers = whispersList.map(w => ({
          id: w.id,
          date: w.date?.split('T')[0],
          type: w.type,
          text: w.text,
          recurrence: w.recurrence,
          isDone: !!w.isDone,
        }));
        setWhispers(mappedWhispers);
      } catch (e) {
        setEvents([]);
        setWhispers([]);
        // optional: console.log('Whispers events load skipped:', e?.response?.data?.message || e.message);
      }
    };
    load();
  }, []);

  const memoryEvents = getEventsForSelectedDay();

  return (
    <div className="flex flex-col h-full bg-bg-deep">

      {/* Date Selector */}
      <DateSelector 
        events={events}
        whispers={whispers}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Whispers List - بالای صفحه */}
        <WhispersList
          whispers={whispers}
          selectedDate={selectedDate}
          onConvertToEvent={handleConvertWhisperToEvent}
          onDeleteWhisper={handleDeleteWhisper}
          onAddWhisper={handleAddWhisper}
        />

        {/* Memory Events - پایین‌تر از whispers */}
        <MemoryEvents events={memoryEvents} />
      </div>

      {/* Whisper Modal */}
      <WhisperModal
        isOpen={whisperModalOpen}
        onClose={() => setWhisperModalOpen(false)}
        onSave={handleSaveWhisper}
        selectedDate={selectedDate}
      />

      {/* Whisper Convert Modal */}
      <WhisperConvertModal
        isOpen={convertModalOpen}
        onClose={() => { setConvertModalOpen(false); setWhisperToConvert(null); }}
        onConfirm={async (file) => {
          try {
            let imagePayload = undefined;
            if (file) {
              const toBase64 = (f) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = reject; reader.readAsDataURL(f); });
              const base64 = await toBase64(file);
              imagePayload = { image: { type: 'base64', data: base64, filename: file.name } };
            }
            const ev = await whispersApi.convertToEvent(whisperToConvert.id, imagePayload?.image ? imagePayload : undefined);
            setConvertModalOpen(false);
            setWhisperToConvert(null);
            handleDeleteWhisper(whisperToConvert.id);
            navigate('/');
          } catch (e) {
            console.log('Convert failed:', e?.response?.data?.message || e.message);
          }
        }}
      />
    </div>
  );
}

export default Whispers;