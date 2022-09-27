# Woovi Challenge Test

## Para rodar o código no backend configurar as variáveis abaixo em um arquivo ".env":

```
MONGOBD_USER=""
MONGOBD_PASSWORD=""
MONGOBD_URI=""
MONGODB_DATABASE=""
PORT=
```

### NOTA: O código foi desenvolvido utilizando o banco de dados MongoDB Atlas, para criar um usuário acesse:

```
https://www.mongodb.com/atlas/database
```

### NOTA 2: Criar um database teste no mongodb atlas, a variável MONGODB_DATABASE será utilizada apenas para verificar a comunicação com o banco de dados.

## Com as devidas variáveis configuradas, rodar o comando abaixo para instalar as bibliotecas utilizadas no projeto:

```
npm install
```

## Com as devidas bibliotecas já instaladas, executar o seguinte comando para se conectar a API do graphql:

```
node src/index.js
```

## Será criada uma pasta com o nome "/data/schema.graphql" referente ao schema do graphql.

## Após isso, acessar o seguinte link:

```
http://localhost:4000/graphql
```

Para criar uma nova anotação utilize o seguinte comando:

```
mutation {
 createNote(content:"DESCRICAO_DA_NOVA_ANOTACAO") {
    content
    _id
  }
}
```

Para visualizar todas as anotações, utilize o seguinte comando:

```
query {
  notes {
    _id
    content
  }
}
```

Para atualizar uma anotação, utilize o seguinte comando:

```
mutation {
 updateNote(_id:"NUMERO_ID", content:"NOVA_ANOTACAO") {
    content
    _id
  }
}
```

E por fim, para excluir uma anotação, utilize o seguinte comando:

```
mutation {
 deleteNote(_id:"NUMERO_ID")
}
```
