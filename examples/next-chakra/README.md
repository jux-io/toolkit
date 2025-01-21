# Example Next.js app with [chakra-ui](https://github.com/chakra-ui/chakra-ui) and Jux

This example features how to use [chakra-ui](https://github.com/chakra-ui/chakra-ui) with Jux within a Next.js app with TypeScript.

## Note

In order for Chakra to not break Jux styling you need to disable Chakra preflight settings (seen in `examples/next-chakra/src/theme.tsx`).
If you do need preflight reset styles, it's possible for Jux Toolkit to create them (can be seen in `examples/next-chakra/jux.config.ts`)
