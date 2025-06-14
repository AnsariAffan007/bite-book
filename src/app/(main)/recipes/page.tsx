import Recipes from '@/views/Public/Recipe/Listing';

async function getData() {
  const res = await fetch("http://localhost:3000/data/recipes.json");
  return res.json()
}

const RecipesPage = async () => {

  const recipes = await getData();

  return (
    <Recipes recipes={recipes} />
  )
}

export default RecipesPage