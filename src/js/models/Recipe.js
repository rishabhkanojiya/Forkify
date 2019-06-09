import Axios from "axios";
import { key, key1, proxy } from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe(params) {
    try {
      const res = await Axios(
        `${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
    }
  }
  calcTime() {
    const npIng = this.ingredients.length;
    const prx = Math.ceil(npIng / 3);
    this.time = prx * 15;
  }
  calcServing() {
    this.serving = 4;
  }

  parseIngredients() {
    const uniLong = [
      "teaspoons",
      "teaspoon",
      "ounces",
      "ounce",
      "tablespoons",
      "tablespoon",
      "cups",
      "pounds"
    ];

    const uniShort = ["tsp", "tsp", "oz", "oz", "tbsp", "tbsp", "cup", "pound"];
    const units = [...uniShort, "kg", "g"];

    const newIngredients = this.ingredients.map(el => {
      let ingredient = el.toLowerCase();

      uniLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, uniShort[i]);
      });
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(el2 => {
        return units.includes(el2);
      });

      let objIng;

      if (unitIndex > -1) {
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" ")
        };
      } else if (parseInt(arrIng[0], 10)) {
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        objIng = {
          count: 1,
          unit: "",
          ingredient
        };
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }
  updateSeerving(type) {
    const newServings = type === "dec" ? this.serving - 1 : this.serving + 1;

    this.ingredients.forEach(ing => {
      ing.count *= newServings / this.serving;
    });
    this.serving = newServings;
  }
}
