import "./admin-panel.css";

const ParticipantListItem = ({ p, makeAdmin, removeFromCall }) => (
  <li>
    <span>
      {p.session_id}: {p.user_name}
    </span>{" "}
    {!p.local && (
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
        <h3>You are a meeting owner.</h3>
      ) : (
        <p>
          You are a call attendee. This section will update if a meeting owner
          gives you admin privileges.
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
