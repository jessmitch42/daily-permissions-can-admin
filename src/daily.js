const createToken = async ({ isOwner, roomName }) => {
  console.log(isOwner, roomName);
  const expiry = Math.round(Date.now() / 1000) + 60 * 60;
  const tokenRes = await fetch("/api/token", {
    method: "POST",
    body: JSON.stringify({ roomName, exp: expiry, isOwner }),
  });
  const tokenData = await tokenRes.json();
  console.log(tokenData);
  if (tokenRes.status !== 200) {
    throw new Error(tokenData.error);
  }
  return tokenData;
};

export const api = {
  createToken,
};
