import { BookmarkAddOutlined, BookmarkAddedRounded, FavoriteBorderRounded, FavoriteRounded, Share } from '@mui/icons-material'
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import styles from "@/styles/recipes.module.css"

const palette = {
  primary: {
    main: "#FF7D29",
    light: "#FFBF78",
    dark: "#FF6D00",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#e2e2e2",
    light: "#eeeeee",
    dark: "#e6aa43",
    contrastText: "#FF6D00"
  },
  background: {
    default: "#e2e2e2",
    paper: "#eeeeee",
  },
}

const RecipeCard = ({ recipeName, userName, description, categoryName }: any) => {

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: palette.background.paper,
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 1 }}>
          <Typography variant='h5'>
            {recipeName}
          </Typography>
          <Typography sx={{ color: '#666', fontSize: '14px' }}>
            By {userName}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.primary">
          {description.slice(0, 220) + " ... "}
          <span style={{ color: palette.primary.main, textDecoration: "underline" }}>check recipe</span>
        </Typography>
        <Box mt={2} display="flex" columnGap={1}>
          <Typography
            className={styles.categoryLabel}
            sx={{ bgcolor: palette.background.default, color: palette.primary.main }}
          >
            {categoryName}
          </Typography>
        </Box>
      </CardContent>
      <CardActions disableSpacing sx={{}}>
        <IconButton aria-label="add to favorites">
          {false
            ? <FavoriteRounded sx={{ color: palette.primary.dark }} />
            : <FavoriteBorderRounded sx={{ color: palette.primary.dark }} />
          }
        </IconButton>
        <IconButton aria-label="share">
          <Share sx={{ color: palette.primary.dark }} />
        </IconButton>
        <IconButton aria-label="share" sx={{ marginLeft: "auto" }}>
          {false
            ? <BookmarkAddedRounded sx={{ color: palette.primary.dark }} />
            : <BookmarkAddOutlined sx={{ color: palette.primary.dark }} />
          }
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default RecipeCard