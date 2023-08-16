import DailyIframe from "@daily-co/daily-js";
import JoinForm from "../JoinForm/JoinForm";
import "./daily-container.css";
import AdminPanel from "../AdminPanel/AdminPanel";
import { useRef, useState } from "react";
import TokenForm from "../TokenForm/TokenForm";

export default function DailyContainer() {
  const containerRef = useRef(null);
  const [callFrame, setCallFrame] = useState(null);

  const handleSubmitJoinForm = async (e) => {
    e.preventDefault();
    const { name: n, url: u } = e.target;
    const name = n.value;
    const url = u.value;
    const callContainerDiv = containerRef.current;

    const dailyCallFrame = DailyIframe.createFrame(callContainerDiv, {
      iframeStyle: {
        width: "100%",
        height: "100%",
      },
      showLeaveButton,
    });

    try {
      await dailyCallFrame.join();
      setCallFrame(dailyCallFrame);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitTokenForm = async (e) => {
    e.preventDefault();
    // create and return token
  };

  return (
    <div className="daily-container">
      <h3>
        1. (Optional) Generate an owner meeting token to join the call as an
        owner.
      </h3>
      <TokenForm handleSubmitTokenForm={handleSubmitTokenForm} />
      <h3>2. Join the call.</h3>
      <JoinForm handleSubmitForm={handleSubmitJoinForm} />
      <div ref={containerRef}></div>
      {callFrame && <AdminPanel />}
    </div>
  );
}
