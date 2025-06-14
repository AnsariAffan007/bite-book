import { theme } from '@/themes/theme'
import { BookmarkAddOutlined, BookmarkAddedRounded, FavoriteBorderRounded, FavoriteRounded, Share } from '@mui/icons-material'
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import styles from "@/styles/recipes.module.css"

const RecipeCard = ({ recipeName, userName, description, categories, }: any) => {
  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: "20px"
        
      }}
    >
      <CardMedia
        component="img"
        height="250"
        image="/images/food/fried-salmon-steak-cooked-green.png"
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.primary">
          {description.slice(0, 220) + " ... "}
          <span style={{ color: theme.palette.primary.main, textDecoration: "underline" }}>check recipe</span>
        </Typography>
        <Box mt={2} display="flex" columnGap={1}>
          {categories.map((category: any, index: number) => (
            <Typography
              className={styles.categoryLabel}
              key={index}
              sx={{ bgcolor: theme.palette.background.default, color: theme.palette.primary.main }}
            >
              {category}
            </Typography>
          ))}
        </Box>
      </CardContent>
      <CardActions disableSpacing sx={{}}>
        <IconButton aria-label="add to favorites">
          {false
            ? <FavoriteRounded sx={{ color: theme.palette.primary.dark }} />
            : <FavoriteBorderRounded sx={{ color: theme.palette.primary.dark }} />
          }
        </IconButton>
        <IconButton aria-label="share">
          <Share sx={{ color: theme.palette.primary.dark }} />
        </IconButton>
        <IconButton aria-label="share" sx={{ marginLeft: "auto" }}>
          {false
            ? <BookmarkAddedRounded sx={{ color: theme.palette.primary.dark }} />
            : <BookmarkAddOutlined sx={{ color: theme.palette.primary.dark }} />
          }
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default RecipeCard