export default {
  newNote: async (_parent: any, args: any, { models }: any) => {
    return await models.Note.create({
      content: args.content,
      author: "Adam Scott",
    });
  },
  deleteNote: async (_parent: any, { id }: any, { models }: any) => {
    try {
      await models.Note.findOneAndRemove({ _id: id });
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (_parent: any, { content, id }: any, { models }: any) => {
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
};
