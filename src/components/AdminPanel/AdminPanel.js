import "./admin-panel.css";

export default function AdminPanel({ participants, makeAdmin }) {
  console.log(participants);
  return (
    <div className="admin-panel">
      <h3>You are a meeting owner.</h3>
      <ul>
        {Object.values(participants).map((p) => (
          <li key={p.session_id}>
            <span>
              {p.session_id}: {p.user_name}
            </span>{" "}
            {!p.local && <button onClick={makeAdmin}>Make admin</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
