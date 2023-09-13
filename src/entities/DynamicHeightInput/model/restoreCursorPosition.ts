import React from "react";

export function restoreCursorPosition(
	textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>,
	focusIndexElement: string,
	positionCursor: number,
	indexElement: string) {
	if (focusIndexElement === indexElement) {
		if(textareaRef !== null){
			if (textareaRef.current) {
					textareaRef.current.selectionStart = positionCursor;
				textareaRef.current.selectionEnd = positionCursor;
				textareaRef.current.focus();
			}
		}

	}
}