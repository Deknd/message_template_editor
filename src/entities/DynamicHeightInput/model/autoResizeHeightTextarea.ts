import React from "react";

export function autoResizeHeightTextarea(textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>): void {
	if (textareaRef.current) {
		const element = textareaRef.current;
		element.style.height = "1.1em";
		element.style.height = element.scrollHeight + "px";
	}
}