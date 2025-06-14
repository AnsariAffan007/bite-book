import CategoryCard from "@/components/Categories/CategoryCard";
import { Box, Grid, Typography } from "@mui/material";

export default function Categories({ categories }: any) {

  return (
    <Box mt={4}>
      <Box textAlign="center">
        <Typography variant="h5" color="primary" fontWeight={600}>Categories</Typography>
      </Box>

      <Grid mt={1} container spacing={2}>
        {categories.map((category: any) => (
          <Grid key={category.id} item xs={6} sm={4} md={3}>
            <CategoryCard
              name={category.name}
              description={category.description}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}