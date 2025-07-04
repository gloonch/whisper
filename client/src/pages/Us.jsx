import DateSelector from "../components/DateSelector";
import DailyContent from "../components/DailyContent";
import RelationshipTimeline from "../components/RelationshipTimeline";

const eventsArray = [
  {
    id: "1",
    date: "2021-01-01",
    type: "MEETING",
    title: "First Meeting",
    imageUrl: "https://placehold.co/64x64/FFDF6E/18181c?text=👋",
  },
  {
    id: "2",
    date: "2021-03-14",
    type: "TRIP",
    title: "Spring Trip",
    imageUrl: "https://placehold.co/64x64/4DA8FF/18181c?text=🚗",
  },
  {
    id: "3",
    date: "2021-06-21",
    type: "BIRTHDAY",
    title: "Birthday Surprise",
    imageUrl: "https://placehold.co/64x64/B588FF/18181c?text=🎂",
  },
  {
    id: "4",
    date: "2022-02-14",
    type: "ANNIVERSARY",
    title: "1st Anniversary",
    imageUrl: "https://placehold.co/64x64/FF9A3C/18181c?text=💖",
  },
  {
    id: "5",
    date: "2022-07-10",
    type: "FIGHT_MAKEUP",
    title: "Big Fight & Makeup",
    imageUrl: "",
  },
  {
    id: "6",
    date: "2023-01-01",
    type: "NOW",
    title: "Now",
    imageUrl: "",
  },
];

function Us() {
  return (
    <div className="flex flex-col h-full text-cream">
      <h1 className="text-2xl font-semibold p-4 app-accent">Us</h1>
      <p className="px-4 pb-2 text-dusty-pink">Timeline of our relationship</p>
      <RelationshipTimeline events={eventsArray} />
      
    </div>
  );
}

export default Us; 