const PROTO_PATH = "./filmes.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const FilmesService = grpc.loadPackageDefinition(packageDefinition).FilmesService;
const client = new FilmesService(
    "localhost:30043",
    grpc.credentials.createInsecure()
);

module.exports = client;