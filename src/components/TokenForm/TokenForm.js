import { useState } from "react";
import "./token-form.css";

export default function TokenForm({ handleSubmitTokenForm }) {
  const [token, setToken] = useState(null);

  const handleSubmit = async () => {
    const tokenResponse = await handleSubmitTokenForm();
  };
  return (
    <form className="token-form" onSubmit={handleSubmit}>
      <input type="submit" value="Generate meeting token" />
    </form>
  );
}
