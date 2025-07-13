import Home from "@/views/Public/Home"
import axios from "axios"
import { headers } from "next/headers"

export const dynamic = 'force-dynamic'

const getRecipes = async () => {
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    const res = await axios.get(`${baseUrl}/api/recipes/public`)
    return { success: true, error: null, response: res, message: res?.data?.message };
  }
  catch (e) {
    return { success: false, error: e, response: null, message: e?.response?.data?.message };
  }
}

const HomePage: React.FC<any> = async () => {

  const { success, message, response } = await getRecipes();

  return (
    <Home
      success={success}
      message={message}
      response={response?.data}
    />
  )
}

export default HomePage