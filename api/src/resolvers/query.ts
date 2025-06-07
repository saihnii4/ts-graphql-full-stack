export default {
  notes: async (_x: any, _y: any, { models }: any) => {
    return await models.Note.find();
  },
  note: async (_parent: any, args: any, { models }: any) => {
    return await models.Note.findOne({ id: args.id });
  },
};
