import Fastify from "fastify";
import { PrismaClient } from "./generated/prisma/index.js";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

const prisma = new PrismaClient();

fastify.get("/", async (req, res) => {
  res.send({ message: "Hi banana!" });
});

fastify.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send({ users });
});

const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

void start();
