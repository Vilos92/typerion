import {type ChangeEvent, type FC, useRef} from 'react';
import tw from 'twin.macro';

import {Icon} from '../../Icon';
import {IconTypesEnum} from '../../Icon/types';

/*
 * Types.
 */

type TypnbOpenButtonProps = {
  onTypnbFileLoad: (fileString: string) => void;
};

/*
 * Styles.
 */

const StyledIconButton = tw.button`flex items-center justify-center rounded p-2 text-black hover:text-white dark:text-white hover:bg-stone-500`;

const StyledFileInput = tw.input`hidden`;

/*
 * Component.
 */

export const TypnbOpenButton: FC<TypnbOpenButtonProps> = ({onTypnbFileLoad}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <StyledIconButton onClick={onButtonClick}>
      <Icon type={IconTypesEnum.FOLDER_OPEN} size={32} />
      <StyledFileInput
        ref={inputRef}
        type="file"
        accept="application/json"
        onChange={event =>
          handleFileInputEvent(event as unknown as ChangeEvent<HTMLInputElement>, onTypnbFileLoad)
        }
      />
    </StyledIconButton>
  );
};

/*
 * Helpers.
 */

function handleFileInputEvent(
  event: ChangeEvent<HTMLInputElement>,
  onFileLoad: (fileString: string) => void
) {
  const file = event.currentTarget.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = event => {
    const file = event?.target?.result;
    if (!file) {
      return;
    }

    const fileString: string = typeof file === 'string' ? file : Buffer.from(file).toString();

    onFileLoad(fileString);
  };
  reader.readAsText(file);
}
