import Editor, {loader} from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import {KeyCode} from 'monaco-editor';
import {type FC, useEffect, useRef} from 'react';

import {ColorSchemesEnum, usePrefersColorScheme} from '../../../hooks';
import {type Handler, type IStandaloneCodeEditor} from '../../../types';

/*
 * Types.
 */

type Monaco = typeof monaco;

type PadEditorProps = {
  defaultValue: string;
  onChange: (value?: string) => void;
  onCmdEnter: Handler;
  onShiftEnter: Handler;
  onCmdUp: Handler | undefined;
  onCmdDown: Handler | undefined;
  onFocus: Handler | undefined;
  onBlur: Handler | undefined;
  setEditor?: (editor: IStandaloneCodeEditor) => void;
};

/*
 * Load Monaco.
 */

// Without doing this, Monaco will be retrieved from a CDN.
loader.config({monaco});

/*
 * Component.
 */

export const PadEditor: FC<PadEditorProps> = ({
  defaultValue,
  onChange,
  onCmdEnter,
  onShiftEnter,
  onCmdUp,
  onCmdDown,
  onFocus,
  onBlur,
  setEditor
}) => {
  const colorScheme = usePrefersColorScheme();

  const theme = colorScheme === ColorSchemesEnum.DARK ? 'vs-dark' : 'vs-light';

  const hasFocusRef = useRef(false);

  // Need to use a ref to ensure that onKeyDown has access to the latest handlers.
  const onCmdEnterRef = useRef(onCmdEnter);
  const onShiftEnterRef = useRef(onShiftEnter);
  const onCmdUpRef = useRef(onCmdUp);
  const onCmdDownRef = useRef(onCmdDown);
  useEffect(() => {
    onCmdEnterRef.current = onCmdEnter;
    onShiftEnterRef.current = onShiftEnter;
    onCmdUpRef.current = onCmdUp;
    onCmdDownRef.current = onCmdDown;
  }, [onCmdDown, onCmdEnter, onCmdUp, onShiftEnter]);

  const onEditorDidMount = (editor: IStandaloneCodeEditor, monaco: Monaco) => {
    // Monaco must be setup immediately after mounting.
    // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    //   // noSemanticValidation: true
    //   // noSyntaxValidation: true
    // });

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

      const activeElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : undefined;

      if (event.keyCode === KeyCode.Enter && (event.metaKey || event.shiftKey)) {
        activeElement?.blur();

        if (event.metaKey) {
          onCmdEnterRef.current();
          setTimeout(() => activeElement?.focus());
        }
        if (event.shiftKey) {
          onShiftEnterRef.current();
        }

        return;
      }

      if (event.metaKey && event.keyCode === KeyCode.UpArrow) {
        onCmdUpRef.current?.();
        return;
      }

      if (event.metaKey && event.keyCode === KeyCode.DownArrow) {
        onCmdDownRef.current?.();
        return;
      }
    });
  };

  return (
    <Editor
      theme={theme}
      height="300px"
      defaultLanguage="typescript"
      defaultValue={defaultValue}
      onMount={onEditorDidMount}
      onChange={onChange}
    />
  );
};
