import { CategoryRounded, InfoOutlined, Login, LogoutOutlined, MenuBookRounded, PersonAddRounded, PersonRounded } from "@mui/icons-material"

interface Option {
  id: number;
  text: string;
  icon: JSX.Element;  // Define icon type as JSX.Element (React component)
  route: string;
}

const generalOptions: Option[] = [
  {
    id: 1,
    text: "Recipes",
    icon: <MenuBookRounded />,
    route: "/recipes"
  },
  {
    id: 2,
    text: "Categories",
    icon: <CategoryRounded />,
    route: "/categories"
  },
  {
    id: 3,
    text: "About",
    icon: <InfoOutlined />,
    route: "/about"
  },
]

const authOptions = [
  {
    id: 4,
    text: "Log In",
    icon: <Login />,
    route: "/login"
  },
  {
    id: 5,
    text: "Sign Up",
    icon: <PersonAddRounded />,
    route: "/signup"
  }
]

const profileOptions = [
  {
    id: 4,
    text: "Profile",
    icon: <PersonRounded />,
    route: "/profile/"
  },
  {
    id: 5,
    text: "Logout",
    icon: <LogoutOutlined />,
    route: "/",
  }
]

export const getGeneralList = () => (
  generalOptions
)

export const getUserList = (isAuthenticated: boolean) => (
  isAuthenticated
    // Inject username in front of profile route
    ? profileOptions.map(
      option => option.id === 4 ? { ...option, route: `/profile/details/` } : { ...option }
    )
    : authOptions
)