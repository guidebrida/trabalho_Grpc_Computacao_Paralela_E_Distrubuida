const client = require("./client");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    client.getAll(null, (err, data) => {
        if (!err) {
            res.render("filmes", {
                results: data.filmes
            });
        }
    });
});

app.post("/save", (req, res) => {
    let newFilme = {
        nome: req.body.nome,
        diretor: req.body.diretor,
        estreia: req.body.estreia
    };

    client.insert(newFilme, (err, data) => {
        if (err) throw err;

        console.log("Filme criado com sucesso", data);
        res.redirect("/");
    });
});

app.post("/update", (req, res) => {
    const updateFilme = {
        id: req.body.id,
        nome: req.body.nome,
        diretor: req.body.diretor,
        estreia: req.body.estreia
    };

    client.update(updateFilme, (err, data) => {
        if (err) throw err;

        console.log("Filme alterado com sucesso", data);
        res.redirect("/");
    });
});

app.post("/remove", (req, res) => {
    client.remove({ id: req.body.filme_id }, (err, _) => {
        if (err) throw err;

        console.log("Filme removido com sucesso");
        res.redirect("/");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server rodando na porta %d", PORT);
});