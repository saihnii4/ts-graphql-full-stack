import mongoose from "mongoose";

export default {
  connect: (DB_HOST: string) => {
    // mongoose.set("useNewUrlParser", true);
    // mongoose.set("useFindAndModify", false);
    // mongoose.set("useCreateIndex", true);
    // mongoose.set("unifiedTopology", true);
    mongoose.connect(DB_HOST);
    mongoose.connection.on("error", (err) => {
      console.error(err);
      console.log("MongoDB Connection Error");
      process.exit();
    });
  },
};
