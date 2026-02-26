import React from 'react';
import { Box } from '@chakra-ui/react'
import Navbar from './NavBar'

const PageLayout = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Box maxW="5xl" mx="auto" py="8">
        {children}
      </Box>
    </Box>
  )
}

export default PageLayout;