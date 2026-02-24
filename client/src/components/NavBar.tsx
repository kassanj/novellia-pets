import React from 'react';
import { Box, Flex, Heading, Link as ChakraLink, Text } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = (): React.ReactElement => {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/pets', label: 'My Pets' }
  ]

  return (
    <Box bg="white" borderBottomWidth="1px" borderColor="gray.200" px="6" py="4">
      <Flex maxW="5xl" mx="auto" align="center" justify="space-between">
        <Heading size="md">🐾 Novellia Pets</Heading>
        <Flex gap="6">
          {links.map(link => (
            <ChakraLink asChild key={link.to}>
              <Link to={link.to}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={pathname === link.to ? 'black.500' : 'gray.500'}
                >
                  {link.label}
                </Text>
              </Link>
            </ChakraLink>
          ))}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar;