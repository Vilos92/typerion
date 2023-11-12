import Editor from '@monaco-editor/react';
import {FC, useEffect, useRef} from 'react';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

/*
 * Types.
 */

type IStandaloneCodeEditor = monacoEditor.editor.IStandaloneCodeEditor;

type PadEditorProps = {
  defaultValue: string;
  onChange: (value?: string) => void;
  onCmdEnter: () => void;
};

/*
 * Component.
 */

export const PadEditor: FC<PadEditorProps> = ({defaultValue, onChange, onCmdEnter}) => {
  const hasFocusRef = useRef(false);

  // Need to use a ref to ensure the handler bound to onKeyDown always has the latest value of onCmdEnter.
  const onCmdEnterRef = useRef(onCmdEnter);
  useEffect(() => {
    onCmdEnterRef.current = onCmdEnter;
  }, [onCmdEnter]);

  const onEditorDidMount = (editor: IStandaloneCodeEditor) => {
    editor.onDidFocusEditorText(() => {
      hasFocusRef.current = true;
    });

    editor.onDidBlurEditorText(() => {
      hasFocusRef.current = false;
    });

    editor.onKeyDown(event => {
      if (!hasFocusRef.current) {
        return;
      }

      // CMD + Enter
      if (!event.metaKey || event.keyCode !== 3) {
        return;
      }

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      onCmdEnterRef.current();
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
