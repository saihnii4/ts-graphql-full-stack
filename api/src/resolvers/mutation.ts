import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config";
import mongoose from "mongoose";

export default {
  newNote: async (_parent: any, args: any, { models, user }: any) => {
    if (!user) throw new Error("authentication required");

    return await models.Note.create({
      content: args.content,
      author: new mongoose.Types.ObjectId(user.id),
    });
  },
  deleteNote: async (_parent: any, { id }: any, { models, user }: any) => {
    if (!user) throw new Error("authentication required");

    const note = await models.Note.findById(id);
    if (!note) throw new Error("note not found");
    if (String(note.author) !== user.id) throw new Error("unauthorized");

    try {
      await note.remove();
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (
    _parent: any,
    { content, id }: any,
    { models, user }: any,
  ) => {
    if (!user) throw new Error("authentication required");

    const note = await models.Note.findById(id);
    if (!note) throw new Error("note not found");
    if (String(note.author) !== user.id) throw new Error("unauthorized");

    return await models.Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          content,
        },
      },
      { new: true },
    );
  },
  signUp: async (
    _parent: any,
    { username, email, password }: any,
    { models }: any,
  ) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    const avatar =
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fas1.ftcdn.net%2Fv2%2Fjpg%2F00%2F64%2F67%2F52%2F1000_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg&f=1&nofb=1&ipt=421d16164467bfca8592299aefef3bde398978a0f8615769cac460d582869696";

    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      });
      return jwt.sign({ id: user._id }, config.JWT_SECRET);
    } catch (err) {
      console.log(err);
      throw new Error("error creating account");
    }
  },
  signIn: async (
    _parent: any,
    { username, email, password }: any,
    { models }: any,
  ) => {
    if (email) email = email.trim().toLowerCase();

    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      // TODO:
      console.error("FUCK");
      return "user-not-found";
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.error("FUCK 2");
      return "invalid-password";
    }

    return jwt.sign({ id: user._id }, config.JWT_SECRET);
  },
};
