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
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [participants, setParticipants] = useState({});

  const handleJoinedMeeting = (e) => {
    console.log(e);
    setParticipants((participants) => ({
      ...participants,
      [e.participants.local.session_id]: e.participants.local,
    }));
  };

  const handleParticipantJoined = (e) => {
    console.log(e);
    console.log(participants);
    setParticipants((participants) => ({
      ...participants,
      [e.participant.session_id]: e.participant,
    }));
  };

  const handleParticipantUpdate = (e) => {
    console.log(e);
    // Return early if the participant list isn't set yet.
    // This event is sometimes emitted before the joined-meeting event.
    if (!participants[e.participant.session_id]) return;
    // Only update the participants list if the permission has changed.
    // Daily Prebuilt handles all other call changes for us.
    if (
      participants[e.participant.session_id].permissions.canAdmin !==
      e.participant.permissions.canAdmin
    ) {
      setParticipants((participants) => ({
        ...participants,
        [e.participant.session_id]: e.participant,
      }));
    }
  };

  const handleParticipantLeft = (e) => {
    console.log(e);
    setParticipants((participants) => {
      const currentParticipants = { ...participants };
      delete currentParticipants[e.participant.session_id];
      return currentParticipants;
    });
  };

  const handleLeftMeeting = useCallback(
    (e) => {
      console.log(e);
      if (callFrame) {
        removeDailyEvents(callFrame);
        callFrame.destroy();
      }
      //Reset state
      setCallFrame(null);
      setUrl(null);
      setIsOwner(false);
      setError(null);
      setSubmitting(false);
      setParticipants({});
    },
    [callFrame]
  );

  const handleError = (e) => {
    console.log(e);
    setError(e.errorMsg);
  };

  const addDailyEvents = (callFrame) => {
    // https://docs.daily.co/reference/daily-js/events
    callFrame
      .on("joined-meeting", handleJoinedMeeting)
      .on("participant-joined", handleParticipantJoined)
      .on("participant-updated", handleParticipantUpdate)
      .on("participant-left", handleParticipantLeft)
      .on("left-meeting", handleLeftMeeting)
      .on("error", handleError);
  };

  const removeDailyEvents = (callFrame) => {
    callFrame
      .off("joined-meeting", handleJoinedMeeting)
      .off("participant-joined", handleParticipantJoined)
      .off("participant-updated", handleParticipantUpdate)
      .off("participant-left", handleParticipantLeft)
      .off("left-meeting", handleLeftMeeting)
      .off("error", handleError);
  };

  const joinRoom = async ({ name, url, token, isOwner }) => {
    console.log(name, url, token);
    const callContainerDiv = containerRef.current;
    // https://docs.daily.co/reference/daily-js/factory-methods/create-frame
    const dailyCallFrame = DailyIframe.createFrame(callContainerDiv, {
      iframeStyle: {
        width: "100%",
        height: "100%",
      },
      showLeaveButton: true,
    });

    addDailyEvents(dailyCallFrame);

    // todo: add event handling for errors, left-meeting

    const options = { userName: name, url };
    if (token) {
      setIsOwner(isOwner);
      options.token = token;
    }

    setSubmitting(true);
    try {
      // https://docs.daily.co/reference/daily-js/instance-methods/join
      await dailyCallFrame.join(options);
      setCallFrame(dailyCallFrame);
      setUrl(url);
      setSubmitting(false);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  const createToken = async (options) => {
    const { token } = await api.createToken(options);
    if (token) {
      return token;
    } else {
      // todo: show error message
      console.error("Token creation failed.");
      return null;
    }
  };

  const handleSubmitJoinForm = async (e) => {
    e.preventDefault();
    const { name: n, owner } = e.target;
    const name = n.value;
    const isOwner = owner.checked;
    const newRoom = await api.createRoom();
    console.log(newRoom);
    if (!newRoom.url) {
      console.error("Room could not be created. Please try again.");
      return;
    }
    const roomName = newRoom.name;

    const newToken = await createToken({ isOwner, roomName });
    if (!newToken) {
      console.error("Token could not be created. Exiting room join.");
      return;
    }
    console.log(newToken, name);

    joinRoom({ name, url: newRoom.url, token: newToken, isOwner });
  };

  const removeFromCall = () => {
    console.log("remove from call");
  };

  const makeAdmin = () => {
    console.log("make admin");
  };

  return (
    <div className="daily-container">
      {!callFrame && !submitting && (
        <>
          <h3>Join the call as an owner or attendee.</h3>
          <p>
            If you join as an owner, you can share admin privileges with others.
          </p>
          <p>(Note: A new Daily room will be created for you when you join.)</p>
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
      {error && <p>Error message: {error}</p>}
      <div className="call" ref={containerRef}></div>
      {callFrame && (
        <AdminPanel
          participants={participants}
          isOwner={isOwner}
          makeAdmin={makeAdmin}
          removeFromCall={removeFromCall}
        />
      )}
    </div>
  );
}
