//funcao para criar o proprio tipo de dados de objeto graphql
//no exemplo abaixo um tipo de nota com seu proprio id (_id) e conteudo (content)

const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql");

const noteType = new GraphQLObjectType({
  name: "Note",
  fields: {
    _id: { type: GraphQLID },
    content: { type: GraphQLString },
  },
});

module.exports = { noteType };
