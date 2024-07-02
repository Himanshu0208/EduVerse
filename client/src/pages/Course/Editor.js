import Quill from "quill";
import { forwardRef, useEffect, useRef } from 'react';

// Editor is an uncontrolled React component
const Editor = forwardRef((props, ref) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div'),
    );
    const quill = new Quill(editorContainer, {
      theme: 'snow',
    });

    // Set ref.current using a callback to ensure it's always up-to-date
    if (ref) {
      if (typeof ref === 'function') {
        ref(quill);
      } else {
        ref.current = quill;
      }
    }

    return () => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(null);
        } else {
          ref.current = null;
        }
      }
      container.innerHTML = '';
    };
  }, [ref]);

  return <div ref={containerRef}></div>;
});

Editor.displayName = 'Editor';

export default Editor;
