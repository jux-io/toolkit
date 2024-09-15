import { styled, css } from '@juxio/react-styled';

const emojiStyles = css({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  opacity: 0,
  transition: 'opacity 0.6s ease',
});

const Text = styled('span', {
  root: {
    fontSize: '16px',
    color: 'violet',
  },
});

const EmojiButton = styled('button', {
  root: {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    padding: '8px 16px',
    border: '1px solid violet',
    display: 'flex',
    alignItems: 'center',

    '&:hover': {
      [`& .${emojiStyles}`]: {
        opacity: 1,
      },
      [`& ${Text}`]: {
        opacity: 0,
      },
    },
  },
});

export default function MyComponent() {
  return (
    <EmojiButton>
      <Text>Hover me!</Text>
      <span className={emojiStyles}>🤖</span>
    </EmojiButton>
  );
}
