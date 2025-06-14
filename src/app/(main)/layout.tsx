import Navbar from "@/components/Utils/Navbar";
import "@/styles/global.css"

const PublicLayout = ({ children }: any) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default PublicLayout;