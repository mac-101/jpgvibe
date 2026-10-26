
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import VisualStory from "../components/VisualStory";
import ValueGrid from "../components/CoreValueGrid";
import LiveVisualFeed from "../components/LiveVisualFeed";

export default function App() {
  return (
    <main>
      <div className="relative">
        <Navbar />
        <Hero />
      </div>

      <VisualStory />
        <LiveVisualFeed/>
        <ValueGrid/>
      {/* Next homepage sections go here */}
    </main>
  );
}
