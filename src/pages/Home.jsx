
import Hero from "../components/Hero";
import VisualStory from "../components/VisualStory";
import ValueGrid from "../components/CoreValueGrid";
import LiveVisualFeed from "../components/LiveVisualFeed";
import ExhibitionFinale from "../components/ExhibitionFinale";
export default function App() {
  return (
    <main>
      <div className="relative">
        <Hero />
      </div>

      <VisualStory />
      <LiveVisualFeed />
      <ValueGrid />
      <ExhibitionFinale />
    </main>
  );
}
