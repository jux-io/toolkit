import { Link as ChakraLink, Button } from '@chakra-ui/react';

import { Container } from './Container';

export const CTA = () => (
  <Container
    flexDirection="row"
    position="fixed"
    bottom={0}
    width="full"
    maxWidth="3xl"
    py={3}
  >
    <ChakraLink
      href="https://chakra-ui.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button
        variant="outline"
        colorScheme="green"
        rounded="button"
        flexGrow={1}
        mx={2}
        width="full"
      >
        chakra-ui
      </Button>
    </ChakraLink>
    <ChakraLink
      href="https://github.com/vercel/next.js/blob/canary/examples/with-chakra-ui"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button
        variant="solid"
        colorScheme="green"
        rounded="button"
        flexGrow={3}
        mx={2}
        width="full"
      >
        View Repo
      </Button>
    </ChakraLink>
  </Container>
);
