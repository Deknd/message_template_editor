import React from "react";

export function updateCursorPosition (
	ref: React.MutableRefObject<HTMLTextAreaElement | null>,
	oldPosition: number): number {
	if(ref !== null){
		if (ref.current) {
			const elem = ref.current;
			if(elem){
				const pos = elem.selectionStart
				return pos;
			}else return oldPosition
		} else {
			return oldPosition
		}
	}else {
		return oldPosition;
	}
}
