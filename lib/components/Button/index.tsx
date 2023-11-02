import tw from 'twin.macro';

const StyledButton = tw.button`rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700`;

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <StyledButton {...props} />;
}
