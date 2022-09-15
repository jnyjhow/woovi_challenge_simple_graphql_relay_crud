//funcao para definir os root schemas (Query, Mutation)
//usadas como rotas de API que resolvem as consultas do banco de dados e outras tarefas relacionadas a servidor

const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const { NotesQuery } = require("./query/NotesQuery");
const {
  CreateNoteMutation,
  UpdateNoteMutation,
  DeleteNoteMutation,
} = require("./mutation/NotesMutation");

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    notes: NotesQuery,
  }),
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    createNote: CreateNoteMutation,
    deleteNote: DeleteNoteMutation,
    updateNote: UpdateNoteMutation,
  }),
});

const schema = new GraphQLSchema({ query: QueryType, mutation: MutationType });

module.exports = schema;
