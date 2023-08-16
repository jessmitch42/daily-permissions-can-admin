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
      removeDailyEvents(callFrame);
      callFrame.destroy();
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

  const createAndJoinRoom = async ({ name, url, token, isOwner }) => {
    console.log(name, url, token);
    const callContainerDiv = containerRef.current;

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

    createAndJoinRoom({ name, url, token: newToken, isOwner });
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
      {error && <p>Error message: {error}</p>}
      <div className="call" ref={containerRef}></div>
      {callFrame && isOwner && <AdminPanel participants={participants} />}
      {callFrame && !isOwner && (
        <p>
          You are a call attendee. This section will update if a meeting owner
          gives you admin privileges.
        </p>
      )}
    </div>
  );
}
