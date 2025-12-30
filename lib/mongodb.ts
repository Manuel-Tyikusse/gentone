import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor, adiciona a MONGODB_URI ao ficheiro .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // No desenvolvimento, usamos uma variável global para não esgotar as conexões
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Em produção, é melhor criar um cliente novo
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;