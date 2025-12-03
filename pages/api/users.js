import fs from "fs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "pages", "api", "db.json");

function readDb() {
  const dbRaw = fs.readFileSync(dbPath);
  return JSON.parse(dbRaw);
}

export default function handler(req, res) {
  const db = readDb();

  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const user = db.users.find((u) => u.id === parseInt(id));
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(200).json(db.users);
    }
  } else if (req.method === "PUT") {
    const { id } = req.query;
    let updatedUser = null;
    db.users = db.users.map((user) => {
      if (user.id === parseInt(id)) {
        updatedUser = { ...user, ...req.body };
        return updatedUser;
      }
      return user;
    });
    if (updatedUser) {
      writeDb(db);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    const initialLength = db.users.length;
    db.users = db.users.filter((user) => user.id !== parseInt(id));
    if (db.users.length < initialLength) {
      writeDb(db);
      res.status(200).json({ message: `User ${id} deleted` });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
