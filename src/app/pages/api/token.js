export default function handler(req, res) {
  if (req.method === "POST") {
    // create token
  } else {
    res.status(200).json({ name: "John Doe" });
  }
}
