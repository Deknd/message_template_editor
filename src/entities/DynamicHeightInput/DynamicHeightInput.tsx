import React, {useEffect, useRef, useState} from "react";
import {autoResizeHeightTextarea, restoreCursorPosition, updateCursorPosition, updateDate,} from "./model";

export interface DynamicHeightInputProps {
	indexElement: string,
	setData: (indexElement: string, dataText: string) => void,
	mapIndexData: Map<string, string>,
	positionCursor: {
		indexElement: string,
		positionCursor: number
	},
	setPositionCursor: (indexElement: string, positionCursor: number) => void,
}


export const DynamicHeightInput: React.FC<DynamicHeightInputProps> = ({
	indexElement,
	setData,
	mapIndexData,
	positionCursor,
	setPositionCursor
}) => {

	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [data, setDataInput] = useState<string>("");
	const [position, setPosition] = useState<number>(positionCursor.positionCursor);
	useEffect(() => {
		if (indexElement === positionCursor.indexElement) {
			setPosition(positionCursor.positionCursor);
		}
	}, [positionCursor]);
	useEffect(() => {
		restoreCursorPosition(textareaRef, positionCursor.indexElement, position, indexElement);
	}, [position]);

	useEffect(() => {
		setDataInput(updateDate(indexElement, mapIndexData));
		restoreCursorPosition(textareaRef, positionCursor.indexElement, position, indexElement);

	}, [indexElement]);
	//при изменении длины, меняется и высота поля
	useEffect(() => {
		autoResizeHeightTextarea(textareaRef);
	}, [textareaRef.current?.scrollHeight, data.length]);
	//при изменении мап меняются данные в стейте
	useEffect(() => {
		setDataInput(updateDate(indexElement, mapIndexData));
	}, [mapIndexData]);

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const pos = updateCursorPosition(textareaRef, position)
		setPosition(pos);
		setPositionCursor(indexElement, pos);
		setData(indexElement, e.target.value);
		setDataInput(e.target.value);
	};
	const handleSetPositionCursor = () => {
		const pos = updateCursorPosition(textareaRef, position)
		setPosition(pos);
		setPositionCursor(indexElement, pos);
	};
	const handleKeyUp = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
			const pos = updateCursorPosition(textareaRef, position);
			setPosition(pos);
			setPositionCursor(indexElement, pos);
		}
	};
	return (
		<div>
		  <textarea
			  ref={textareaRef}
			  onFocus={handleSetPositionCursor}
			  onChange={handleTextChange}
			  onKeyUp={handleKeyUp}
			  onClick={handleSetPositionCursor}
			  style={{
				  width: "100%",
				  resize: "none",
				  borderRadius: "0.5em",
				  //transition: "height 0.01s"
			  }}
			  value={data}/>
		</div>
	);

};