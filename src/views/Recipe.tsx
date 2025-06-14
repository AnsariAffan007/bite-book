'use client';

import { getShade } from '@/styles/shader';
import { theme } from '@/themes/theme';
import { BookmarkAddOutlined, LocalDiningRounded } from '@mui/icons-material'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import styles from '@/styles/recipes.module.css';

const Recipe = ({
  recipe: {
    recipe: { name, description, categories },
    randomImage
  }
}: any) => {

  const MD_UP = useMediaQuery((theme: any) => theme.breakpoints.up("md"));

  return (
    <Box display="flex" flexDirection="column" rowGap={4} mt={4}>

      {/* Recipe HEAD. Contains description, action buttons, and the image */}
      <Box
        display="flex"
        alignItems="center"
        flexDirection={MD_UP ? 'row' : 'column'}
        gap={4}
        sx={{ backgroundColor: getShade(0, 0.03), padding: 4, borderRadius: 4 }}
      >

        {/* Description */}
        <Box display="flex" flexDirection="column" rowGap={4} order={MD_UP ? 1 : 2}>
          <Typography variant="h5" sx={{ color: theme.palette.primary.dark, fontWeight: 900 }}>{name}</Typography>
          <Typography textAlign="justify">{description}</Typography>
          {/* Categories */}
          <Box sx={{ display: "flex", gap: 1, }}>
            {categories.map((category: any, index: number) => (
              <Typography
                key={index}
                className={styles.categoryLabel}
                sx={{ bgcolor: getShade(1, 0.25), color: theme.palette.primary.dark, fontWeight: 600 }}
              >
                {category}</Typography>
            ))}
          </Box>
          <Box display="flex" columnGap={2}>
            <Button disableElevation variant="outlined" startIcon={<BookmarkAddOutlined />}>Bookmark</Button>
            <Button disableElevation variant="contained" startIcon={<LocalDiningRounded />}>Prepare</Button>
          </Box>
        </Box>

        {/* Image */}
        <Box sx={{ borderRadius: "50%" }} order={MD_UP ? 2 : 1}>
          <Image
            src={randomImage.image}
            alt={`Picture of ${name}`}
            width={400}
            height={400}
            style={{ borderRadius: "50%" }}
            priority={true}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Recipe