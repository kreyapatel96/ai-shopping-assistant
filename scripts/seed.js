import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { MongoClient } from "mongodb";
import fs from "fs";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();

    const db = client.db("ai-shopping-assistant");
    const products = db.collection("products");

    const data = JSON.parse(
      fs.readFileSync("./data/products.json", "utf-8")
    );

    await products.insertMany(data);

    console.log("Products inserted successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

seed();