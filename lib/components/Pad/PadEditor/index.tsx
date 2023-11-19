import Editor from '@monaco-editor/react';
import {FC, useEffect, useRef} from 'react';

import {Handler, IStandaloneCodeEditor} from '../../../types';

/*
 * Types.
 */

type PadEditorProps = {
  defaultValue: string;
  onChange: (value?: string) => void;
  onCmdEnter: Handler;
  onShiftEnter: Handler;
  onFocus: Handler | undefined;
  onBlur: Handler | undefined;
  setEditor?: (editor: IStandaloneCodeEditor) => void;
};

/*
 * Component.
 */

export const PadEditor: FC<PadEditorProps> = ({
  defaultValue,
  onChange,
  onCmdEnter,
  onShiftEnter,
  onFocus,
  onBlur,
  setEditor
}) => {
  const hasFocusRef = useRef(false);

  // Need to use a ref to ensure that onKeyDown has access to the latest handlers.
  const onCmdEnterRef = useRef(onCmdEnter);
  const onShiftEnterRef = useRef(onShiftEnter);
  useEffect(() => {
    onCmdEnterRef.current = onCmdEnter;
    onShiftEnterRef.current = onShiftEnter;
  }, [onCmdEnter, onShiftEnter]);

  const onEditorDidMount = (editor: IStandaloneCodeEditor) => {
    // New pads should always have immediate focus.
    hasFocusRef.current = true;
    editor.focus();
    onFocus?.();

    if (setEditor) {
      setEditor(editor);
    }

    editor.onDidFocusEditorText(() => {
      hasFocusRef.current = true;
      onFocus?.();
    });

    editor.onDidBlurEditorText(() => {
      hasFocusRef.current = false;
      onBlur?.();
    });

    editor.onKeyDown(event => {
      if (!hasFocusRef.current) {
        return;
      }

      // (CMD or Shift) + Enter
      if (!(event.metaKey || event.shiftKey) || event.keyCode !== 3) {
        return;
      }

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      if (event.metaKey) {
        onCmdEnterRef.current();
        return;
      }

      if (event.shiftKey) {
        onShiftEnterRef.current();
        return;
      }
    });
  };

  return (
    <Editor
      height="300px"
      defaultLanguage="typescript"
      defaultValue={defaultValue}
      onMount={onEditorDidMount}
      onChange={onChange}
    />
  );
};
