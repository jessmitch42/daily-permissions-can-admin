import "./join-form.css";

export default function JoinForm({ handleSubmitForm }) {
  return (
    <div>
      <form className="join-form" onSubmit={handleSubmitForm}>
        <label htmlFor="name">Your name</label>
        <input id="name" type="text" />
        <div className="row">
          <label className="checkbox-label" htmlFor="owner">
            Join as an owner?
          </label>
          <input id="owner" type="checkbox" />
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}
