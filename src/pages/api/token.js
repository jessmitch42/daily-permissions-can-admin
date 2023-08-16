export default async function handler(req, res) {
  console.log("hi");
  const { roomName, exp, isOwner } = JSON.parse(req.body);
  console.log(roomName, exp);
  try {
    switch (req.method) {
      case "POST":
        // create token
        const dailyTokenRes = await fetch(
          "https://api.daily.co/v1/meeting-tokens",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + process.env.DAILY_API_KEY,
            },
            body: JSON.stringify({
              properties: { room_name: roomName, exp, is_owner: isOwner },
            }),
          }
        );
        const { token } = await dailyTokenRes.json();
        res.status(200).json({ token });
        break;
      default:
        res.status(405).end(`${method} Not Allowed`);
        break;
    }
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
}
