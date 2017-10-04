const router = require("express").Router();
const fetch = require("isomorphic-fetch");
const Recipe = require("../models/Recipe");
const {
  buildRecipePrefs,
  buildRecipeURL,
  sanitizeRecipes,
  buildDbQuery
} = require("../util/recipes");

router.get("/", async (req, res, next) => {
  try {
    let { q, preferences } = req.query;
    preferences = preferences ? preferences : "";
    const queryPrefs = buildRecipePrefs(preferences);

    let apiResponse = await fetch(buildRecipeURL([`q=${q}`, ...queryPrefs]));
    apiResponse = sanitizeRecipes(await apiResponse.json());

    const dbResponse = await Recipe.find(buildDbQuery(q, preferences));
    res.json(dbResponse.concat(apiResponse));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    res.json({ warning: "not implemented" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    res.json({ warning: "not implemented" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    res.json({ warning: "not implemented" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
