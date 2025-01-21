import { Link as ChakraLink, Text, Code, List } from '@chakra-ui/react';

import { Hero } from '../components/Hero';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';
import { MyButton } from '../jux/components/MyButton';
import { css } from '@juxio/react-styled';
import { ColorModeButton } from '../components/ui/color-mode';

const Index = () => (
  <Container height="100vh">
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '100px',
      })}
    >
      <MyButton />
    </div>
    <Hero title="with-chakra-ui-typescript" />
    <Main>
      <Text color="text">
        Example repository of <Code>Next.js</Code> + <Code>chakra-ui</Code> +{' '}
        <Code>TypeScript</Code>.
      </Text>

      <List.Root gap={3} my={0} color="text">
        <List.Item>
          <List.Indicator color="green.500">
            <ChakraLink
              target="_blank"
              rel="noopener noreferrer"
              href="https://chakra-ui.com"
              flexGrow={1}
              mr={2}
            >
              Chakra UI
            </ChakraLink>
          </List.Indicator>
        </List.Item>
        <List.Item>
          <List.Indicator color="green.500" />
          <ChakraLink
            target="_blank"
            rel="noopener noreferrer"
            href="https://nextjs.org"
            flexGrow={1}
            mr={2}
          >
            Next.js
          </ChakraLink>
        </List.Item>
      </List.Root>
    </Main>

    <ColorModeButton />
    <Footer>
      <Text>Next ❤️ Chakra</Text>
    </Footer>
    <CTA />
  </Container>
);

export default Index;
