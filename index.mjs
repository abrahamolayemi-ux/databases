import "dotenv/config";
import express from "express";
import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });


const app = express ();

app.use(express.json());
//Get all users
app. get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

//Get a single user
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({where: {id: id}});
  res.json(user);
});

//Create a new user
app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;
  try  {
    const user = await prisma.user.create({data: { name, email, age }});
    res.json(user);
  } catch (error)
   {} res.status(500).send("An error occured: " + error);
  }
);

//Update a user (full)
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const user = await prisma.user.update({where: {id: id}, data: { name, email, age }});
    res.json(user);
  } catch (error) {
    res.status(500).send("An error occured: " + error);
  }
});

//Update a user (partial)
app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const user = await prisma.user.update({where: {id: id}, data: { name, email, age }});
    res.json(user);
  } catch (error) {
    res.status(500).send("An error occured: " + error);
  }
});

//Delete a users
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({where: {id: id}});
    res.json({message: "User deleted successfully"});
  } catch (error) {
    res.status(500).send("An error occured: " + error);
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  