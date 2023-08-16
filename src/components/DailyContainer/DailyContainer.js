import { useCallback, useRef, useState } from "react";
import DailyIframe from "@daily-co/daily-js";
import JoinForm from "../JoinForm/JoinForm";
import AdminPanel from "../AdminPanel/AdminPanel";
import { api } from "../../daily";
import "./daily-container.css";

export default function DailyContainer() {
  const containerRef = useRef(null);
  const [callFrame, setCallFrame] = useState(null);
  const [url, setUrl] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const createToken = async (options) => {
    const { token } = await api.createToken(options);
    if (token) {
      setIsOwner(true);
      return token;
    } else {
      // todo: show error message
      console.error("Token creation failed.");
      return null;
    }
  };

  const createAndJoinRoom = async ({ name, url, token }) => {
    const callContainerDiv = containerRef.current;

    const dailyCallFrame = DailyIframe.createFrame(callContainerDiv, {
      iframeStyle: {
        width: "100%",
        height: "100%",
      },
      showLeaveButton: true,
    });

    // todo: add event handling for errors, left-meeting

    const options = { userName: name, url };
    if (token) {
      options.token = token;
    }

    setSubmitting(true);
    try {
      await dailyCallFrame.join(options);
      setCallFrame(dailyCallFrame);
      setUrl(url);
      setSubmitting(false);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  const handleSubmitJoinForm = async (e) => {
    e.preventDefault();
    const { name: n, url: u, owner: o } = e.target;
    const name = n.value;
    const url = u.value;
    // the room name is the path in the url (domain.daily.co/room-name)
    const roomName = url.split(".co/")[1];
    const isOwner = owner.checked;

    const newToken = await createToken({ isOwner, roomName });
    if (!newToken) {
      console.error("token failed, exiting room join.");
      return;
    }

    createAndJoinRoom({ name, url, token: newToken });
  };
  return (
    <div className="daily-container">
      {!callFrame && !submitting && (
        <>
          <h3>Join the call as an owner or attendee.</h3>
          <p>
            If you join as an owner, you can share admin privileges with others.
          </p>
          <JoinForm handleSubmitForm={handleSubmitJoinForm} />
        </>
      )}
      {submitting && <p>Loading...</p>}
      <div>
        {url && (
          <>
            {" "}
            <p>Share this link to let others join:</p>{" "}
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </>
        )}
      </div>
      <div class="call" ref={containerRef}></div>
      {callFrame && isOwner && <AdminPanel />}
    </div>
  );
}
