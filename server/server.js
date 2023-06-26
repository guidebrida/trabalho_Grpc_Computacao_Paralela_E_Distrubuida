const PROTO_PATH = "./filmes.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var filmesProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();
const filmes = [
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        nome: "Vingadores: Guerra infinita",
        diretor: "irmãos russo",
        estreia: "2018-05-04"
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        nome: "Titanic",
        diretor: "James cameron",
        estreia: "1999-05-26"
    }
];

server.addService(filmesProto.FilmesService.service, {
    getAll: (_, callback) => {
        callback(null, { filmes });
    },

    get: (call, callback) => {
        let filme = filmes.find(n => n.id == call.request.id);

        if (filme) {
            callback(null, filme);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    insert: (call, callback) => {
        let filme = call.request;

        filme.id = uuidv4();
        filmes.push(filme);
        callback(null, filme);
    },

    update: (call, callback) => {
        let existingFilme = filmes.find(n => n.id == call.request.id);

        if (existingFilme) {
            existingFilme.nome = call.request.nome;
            existingFilme.diretor = call.request.diretor;
            existingFilme.estreia = call.request.estreia;
            callback(null, existingFilme);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    remove: (call, callback) => {
        let existingFilmeIndex = filmes.findIndex(
            n => n.id == call.request.id
        );

        if (existingFilmeIndex != -1) {
            filmes.splice(existingFilmeIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    }
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server rodando http://127.0.0.1:30043");
server.start();