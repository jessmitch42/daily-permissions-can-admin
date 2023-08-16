"use client";
import Header from "@/components/Header/Header";
import "./page.css";
import DailyContainer from "@/components/DailyContainer/DailyContainer";

export default function Home() {
  return (
    <main className="main">
      <Header />
      <h1>Daily permissions demo</h1>
      <h2>Use the canAdmin option to share admin privileges</h2>

      <div className="center">
        <DailyContainer />
      </div>
    </main>
  );
}
