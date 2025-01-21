import { Flex, Heading } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';

export const Hero = ({ title }: { title: string }) => {
  const textColor = useColorModeValue('text.base', 'text.dark');
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
      bgClip="text"
    >
      <Heading color={textColor} fontSize="6vw">
        {title}
      </Heading>
    </Flex>
  );
};

Hero.defaultProps = {
  title: 'with-chakra-ui-typescript',
};
