import DateSelector from "../components/DateSelector";

function Whispers() {
  return (
    <div className="p-4 text-cream h-full">
      <h1 className="text-2xl font-semibold app-accent">Whispers</h1>
      <p className="text-dusty-pink">Emotional reminders will be shown here.</p>
      <DateSelector />
    </div>
  );
}

export default Whispers;