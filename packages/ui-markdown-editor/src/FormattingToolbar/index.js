import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ReactEditor, useEditor } from 'slate-react';
import { Transforms } from 'slate';

import { InsertImageButton } from '../plugins/withImages';
import ToolbarMenu from './ToolbarMenu';
import FormatButton from './FormatButton';
import InsertButton from './InsertButton';
import HistoryButton from './HistoryButton';
import HyperlinkButton from './HyperlinkButton';
import StyleDropdown from './StyleFormat';
import HyperlinkModal from './HyperlinkModal';
import {
  toggleBlock, isBlockActive,
  toggleMark, isMarkActive,
  toggleHistory, insertThematicBreak
} from '../utilities/toolbarHelpers';
import {
  bold, italic, code, code_block,
  quote, olist, ulist,
  image, link, undo, redo,
  tbreak, Separator
} from '../components/icons';

const mark = { toggleFunc: toggleMark, activeFunc: isMarkActive };
const block = { toggleFunc: toggleBlock, activeFunc: isBlockActive };
const history = { toggleFunc: toggleHistory };
const insert = { toggleFunc: insertThematicBreak };

const FormattingToolbar = ({
  canBeFormatted,
  showLinkModal,
  setShowLinkModal,
  activeButton
}) => {
  const editor = useEditor();
  const linkModalRef = useRef();

  const buttonProps = {
    canBeFormatted,
    activeButton
  };

  const linkProps = {
    showLinkModal,
    setShowLinkModal
  };

  useEffect(() => {
    if (showLinkModal) {
      const el = linkModalRef.current;
      const domRange = ReactEditor.toDOMRange(editor, editor.selection);
      const rect = domRange.getBoundingClientRect();
      const CARET_TOP_OFFSET = 15;
      el.style.opacity = 1;
      el.style.top = `${
        rect.top + rect.height + window.pageYOffset + CARET_TOP_OFFSET
      }px`;
      const hyperlinkCaret = el.children[0];
      let calPos = rect.left  - el.offsetWidth / 2  ;


      // When the modal goes off page from left side
      if (calPos < 0) {
        // start from 10px 
        calPos = 10;
        hyperlinkCaret.style.left = `${rect.left - 10}px`;
      }

      // calculate the endpoint of the modal
      const rightEndPos = calPos + el.offsetWidth,
        containerWidth = el.parentElement.offsetWidth;

      // When the modal goes off the page from right side
      if (rightEndPos > containerWidth) {
        let diff = rightEndPos-containerWidth;
        // extra space of 10px on right side to look clean
        diff+=10;
        calPos=calPos-diff;
        let shift=diff-5;
        hyperlinkCaret.style.left= `calc(50% + ${shift}px)`;
      }

      el.style.left = `${calPos}px`;
    }
  }, [editor, showLinkModal]);

  return (
    <ToolbarMenu id="ap-rich-text-editor-toolbar">
      <StyleDropdown canBeFormatted={canBeFormatted}/>
      <Separator />
      <FormatButton {...mark} {...bold} {...buttonProps} />
      <FormatButton {...mark} {...italic} {...buttonProps} />
      <FormatButton {...mark} {...code} {...buttonProps} />
      <Separator />
      <FormatButton {...block} {...quote} {...buttonProps} />
      <FormatButton {...block} {...olist} {...buttonProps} />
      <FormatButton {...block} {...ulist} {...buttonProps} />
      <FormatButton {...block} {...code_block} {...buttonProps} />
      <Separator />
      <HistoryButton {...history} {...undo} />
      <HistoryButton {...history} {...redo} />
      <Separator />
      <HyperlinkButton {...linkProps} {...link} {...buttonProps} />
      <InsertImageButton {...image} canBeFormatted={canBeFormatted} />
      <InsertButton {...insert} {...tbreak} canBeFormatted={canBeFormatted} />
      { showLinkModal && <HyperlinkModal ref={linkModalRef} {...linkProps} /> }
    </ToolbarMenu>
  );
};

FormattingToolbar.propTypes = {
  canBeFormatted: PropTypes.func,
  showLinkModal: PropTypes.bool,
  setShowLinkModal: PropTypes.func,
  activeButton: PropTypes.object,
};


export default FormattingToolbar;