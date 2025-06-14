import Categories from "@/views/Public/Categories";
import axios from "axios";
import { headers } from "next/headers";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

const getCategories = async () => {
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    const res = axios.get(`${baseUrl}/api/categories/public`)
    return res;
  }
  catch (e) {
    return null;
  }
}

const Page = async () => {

  const categories = await getCategories();

  return (
    <Suspense>
      <Categories categories={categories?.data?.data} />
    </Suspense>
  )
}

export default Page