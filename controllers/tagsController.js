const tags = [
  "Entrada",
  "Plato principal",
  "Dulce",
  "Ensalada",
  "Sopa",
  "Tarta",
  "Vegano",
  "Vegetariano",
  "Rápido y fácil",
  "Plato Frío",
  "Plato Caliente",
  "Picante",
  "Light",
  "Para golosos",
  "Sin TAAC",
  "Parrilla",
  "Agridulce",
  "Desayuno",
  "Snack",
  "Económico",
  "Salsa",
  "Para niños",
];

async function getAllTags(req, res) {
    res.json(tags); 
}

exports.getAllTags = getAllTags;