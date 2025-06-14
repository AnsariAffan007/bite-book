import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Recipe name is required").max(40, "Cannot exceed 40 characters"),
  category: Yup.mixed().required("Recipe category is required"),
  description: Yup.string().max(400, "Cannot exceed 400 characters"),
  preptime: Yup.number().required("Preparation Time is required"),
  difficulty: Yup.string().required("Difficulty is required"),
  mealtime: Yup.array().of(Yup.string()).required("Meal time is required"),
  servings: Yup.string().required('Number of servings is required'),
  ingredients:
    Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Name is required"),
        quantity: Yup.number().required("Quantity is required"),
        unit: Yup.string().required("Unit is required"),
        type: Yup.string().required('Type is required')
      })
    )
})

export default validationSchema

export const ingredientSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  quantity: Yup.number().required("Quantity is required"),
  unit: Yup.string().required("Unit is required"),
  type: Yup.string().required('Type is required')
})