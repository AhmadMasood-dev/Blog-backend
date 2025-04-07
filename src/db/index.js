import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const connectDB = async () => {
  try {
    const connectionString = `${process.env.MONGODB_URL}/${DB_NAME}`;
    const connectionInstance = await mongoose.connect(connectionString);
    // const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\nMongoDB connected !! DB_HOST : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR", error);
    process.exit(1);

  }
}
export default connectDB

