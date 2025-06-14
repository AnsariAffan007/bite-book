import Categories from "@/views/Public/Categories";

async function getData() {
  const res = await fetch("http://localhost:3000/data/categories.json");
  return res.json()
}

const Page = async () => {

  const categories = await getData();

  return (
    <Categories categories={categories} />
  )
}

export default Page