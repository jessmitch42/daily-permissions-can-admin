import "./join-form.css";

export default function JoinForm({ handleSubmitForm }) {
  return (
    <form className="join-form" onSubmit={handleSubmitForm}>
      <label htmlFor="name">Your name</label>
      <input id="name" type="text" />
      <label htmlFor="url">Daily room URL</label>
      <input id="url" type="url" pattern="https://.*" required />
      <p>If you are joining as a call owner, include a meeting token.</p>
      <label htmlFor="token">Owner meeting token</label>
      <input id="token" type="text" />
      <input type="submit" />
    </form>
  );
}
