//inciso 1
db.personas.updateMany(
    {},
    {
        $rename: {
            "Nombre-Completo": "fullname",
            "Telefono": "phone",
            "Correo-Electronico": "email",
            "Direccion": "address",
            "Genero": "gender"
        }
    } 
);

//inciso 2
db.personas.aggregate([
    {
        $project: {
            gender: 1,
            lastname: { $arrayElemAt: [ { $split: [ "$fullname", " " ] }, -1 ] }
        }
    },
    {
        $group: {
            _id: { gender: "$gender", lastname: "$lastname" },
            count: { $sum: 1 }
        }
    },
    {
        $sort: { count: 1 }
    },
    {
        $group: {
            _id: "$_id.gender",
            bottom_lastnames: { $push: "$_id.lastname" },
            count: { $push: "$count" }
        }
    },
    {
        $sort: { _id: 1 }
    },
    {
        $project: {
            _id: 1,
            bottom_lastnames: { $slice: [ "$bottom_lastnames", 0, 15 ] }
        }
    },
    {
        $out: "personas_gender_lastnames_bottom.json"
    }
]);

//inciso 3
db.personas.aggregate([
   {
      $project: {
         gender: 1,
         name: {$split: ["$fullname", " "]}
      }
   },
   {
      $unwind: "$name"
   },
   {
      $group: {
         _id: {name: "$name", gender: "$gender"},
         count: {$sum: 1}
      }
   },
   {
      $sort: {count: -1}
   },
   {
      $group: {
         _id: "$_id.gender",
         top_names: { $push: { name: "$_id.name", freq: "$count" } }
      }
   },
   {
      $project: {
         _id: "$_id",
         top_names: {$slice: ["$top_names", 5]}
      }
   },
   {
        $out: "personas_gender_firstnames_top.json"
    }
]);

//inciso 4
db.personas.aggregate([
    { $project: {
        domain: { $substrCP: [ "$email", { $indexOfCP: [ "$email", "@" ] }, { $strLenCP: "$email" } ] },
        username: { $substrCP: [ "$email", 0, { $indexOfCP: [ "$email", "@" ] } ] },
        gender: 1
    } },
    { $group: {
        _id: "$domain",
        total: { $sum: 1 },
        avg_length: { $avg: { $strLenCP: "$username" } }
    } },
    { $sort: { total: -1 } },
    {
        $out: "personas_domains_stats.csv"
    }
]);

//inciso 5
db.personas.aggregate([
    {
        $project: {
            address_word: {
                $cond: {
                    if: { $regexMatch: { input: "$address", regex: /Avenue|Road|Trail|Crossing|Park|Way|Point|Place/ } },
                    then: { $arrayElemAt: [ { $split: ["$address", " "] }, { $indexOfArray: [ { $split: ["$address", " "] }, { $regexMatch: { input: "$address", regex: /Avenue|Road|Trail|Crossing|Park|Way|Point|Place/ } } ] } ] },
                    else: "otros"
                }
            }
        }
    },
    {
        $group: {
            _id: "$address_word",
            total: { $sum: 1 }
        }
    },
    {
        $sort: { total: -1 }
    },
    {
        $out: "personas_address_stats.csv"
    }
]);





db.personas.find()
