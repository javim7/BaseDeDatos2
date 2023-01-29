//inciso 1
db.vehiculos.updateMany(
    {},
    {
        $rename: {
            "Id-del-Coche": "id",
            "Marca-del-Coche": "brand",
            "Modelo-del-Coche": "model",
            "Año-del-Coche" : "year",
            "Precio-del-Coche": "price"
        }
    } 
);

//inciso 2
db.vehiculos.updateMany(
    {}, 
    [{$set: {price: {$toDecimal: {$substr: ["$price", 1, -1]}}}}]
 );
 
 //inciso 3
db.vehiculos.aggregate([
    {
        $group: {
            _id: { brand: "$brand", year: "$year" },
            total_models: { $sum: 1 },
            avg_price: { $avg: "$price" }
        }
    },
    {
        $group: {
            _id: "$_id.brand",
            stats: {
                $push: {
                    year: "$_id.year",
                    total_models: "$total_models",
                    avg_price: "$avg_price"
                }
            }
        }
    }, 
    {$out: "vehiculos_brand_stats.json" }
]);

//inciso 4
db.vehiculos.aggregate([
    {
        $match: {
            $and: [
                { year: { $gte: 1990 } },
                { year: { $lt: 2000 } }
            ]
        }
    },
    {
        $sort: { price: -1 }
    },
    {
        $limit: 20
    },
    {
        $project: {
            _id: { $concat: [ "$brand", " ", "$model" ] },
            year: 1,
            price: 1
        }
    }, 
    {$out: "vehiculos_top_models.csv"}
]);

//inciso 5
db.vehiculos.aggregate([
    {
        $match: {
            year: {$gte: 2000},
            brand: {
                $in: [
                    "Toyota", "Honda", "Nissan", "Hyundai", "Kia",
                    "Mercedes-Benz", "BMW", "Audi", "Volkswagen", "Volvo"
                ]
            }
        }
    },
    {
        $group: {
            _id: {
                $cond: [
                    {
                        $or: [
                            {$eq: ["$brand", "Toyota"]},
                            {$eq: ["$brand", "Honda"]},
                            {$eq: ["$brand", "Nissan"]},
                            {$eq: ["$brand", "Hyundai"]},
                            {$eq: ["$brand", "Kia"]}
                        ]
                    },
                    "Asian",
                    "European"
                ]
            },
            top_brands: {
                $push: {
                    brand: "$brand",
                    avg_price: {
                        $avg: "$price"
                    }
                }
            }
        }
    },
    {
        $unwind: "$top_brands"
    },
    {
        $sort: {
            "top_brands.avg_price": -1
        }
    },
    {
        $group: {
            _id: "$_id",
            top_brands: {
                $push: "$top_brands"
            }
        }
    },
    {
        $project: {
            _id: 1,
            top_brands: {
                $slice: ["$top_brands", 5]
            }
        }
    },
    {$out: "vehiculos_market_top_brands.json"}
]);
