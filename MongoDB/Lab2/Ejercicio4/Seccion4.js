//inciso 1
db.peliculas.updateMany(
    {},
    {
        $rename: {
            "Nombre-de-la-pelicula": "name",
            "Año-de-la-pelicula": "year",
            "Genero-de-la-pelicula": "genre",
            "Precio-de-la-entrada-de-la-pelicula": "ticket_price"
        }
    } 
);

//inciso 2
db.peliculas.updateMany(
    {}, 
    [{$set: {genre: {$split: ["$genre", "|"]}}}]
);

db.peliculas.updateMany(
    {}, 
    [{$set: {ticket_price: {$toDecimal: {$substr: ["$ticket_price", 1, -1]}}}}],
);

//inciso 3
db.peliculas.aggregate([
    {$project: { name: 1, words: { $split: ["$name", " "] } }},
    {$unwind: "$words"},
    {$group: { _id: "$words", total: { $sum: 1 } }},
    {$sort: { total: -1 }},
    {$limit: 100},
    {$out : "peliculas_wordcloud.csv"}
]);

//inciso 4
db.peliculas.aggregate([
    {
        $group: {
            _id: "$year",
            price_min: { $min: "$ticket_price" },
            price_avg: { $avg: "$ticket_price" },
            price_max: { $max: "$ticket_price" }
        }
    },
    {
        $sort: { _id: 1 }
    }, 
    {$out: "peliculas_year_pricing.csv"}
]);

//inciso 5
db.peliculas.aggregate([
    {
        $unwind: "$genre"
    },
    {
        $group: {
            _id: "$genre",
            years: { $push: "$year" }
        }
    },
    {
        $project: {
            _id: 1,
            years: {
                $slice: ["$years", 5]
            }
        }
    },
    {$out: "peliculas_genre_top_years.json"}
]);


