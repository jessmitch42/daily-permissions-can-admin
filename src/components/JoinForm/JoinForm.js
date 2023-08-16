import "./join-form.css";

export default function JoinForm({ handleSubmitForm }) {
  return (
    <div>
      <form className="join-form" onSubmit={handleSubmitForm}>
        <label htmlFor="name">Your name</label>
        <input id="name" type="text" />
        <label htmlFor="url">Daily room URL</label>
        <input
          id="url"
          type="url"
          pattern="https://.*"
          placeholder="https://your-domain.daily.co/room-name"
          required
        />
        <div class="row">
          <label class="checkbox-label" htmlFor="owner">
            Join as an owner?
          </label>
          <input id="owner" type="checkbox" />
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}
