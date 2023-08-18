import "./admin-panel.css";

const ParticipantListItem = ({ p, makeAdmin, removeFromCall, isOwner }) => (
  <li>
    <span>
      {p.session_id}: {p.user_name}
    </span>{" "}
    {!p.local && isOwner && (
      <span>
        <button onClick={makeAdmin}>Make admin</button>
        <button className="red-button" onClick={removeFromCall}>
          Remove from call
        </button>
      </span>
    )}
  </li>
);

export default function AdminPanel({
  participants,
  makeAdmin,
  removeFromCall,
  isOwner,
}) {
  console.log(participants);
  return (
    <div className="admin-panel">
      {isOwner ? (
        <h3>
          Participant list - You are a meeting owner and can remove others or
          make them admins
        </h3>
      ) : (
        <p>
          You are a call attendee. If a meeting owner gives you admin
          privileges, additional actions will become available.
        </p>
      )}

      <ul>
        {Object.values(participants).map((p) => (
          <ParticipantListItem
            key={p.session_id}
            p={p}
            makeAdmin={makeAdmin}
            isOwner={isOwner}
            removeFromCall={removeFromCall}
          />
        ))}
      </ul>
    </div>
  );
}
