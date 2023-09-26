import React, {useEffect, useMemo, useRef} from "react";
import style from "./editableTextBlock.module.css";

export interface EditableTextBlockProps {
	indexElement: string,
	updateElementText?: (indexElement: string, dataText: string) => void,
	indexDataMap: Map<string, string>,
	focusElement?: string;
	getPosition?: (indexElement: string) => number;
	setPositionCursor?: (indexElement: string, positionCursor: number) => void,
	isReadonly?: boolean,
	className?: string | undefined
}

/**
 * The EditableTextBlock component represents an editable text field.
 *
 * @param {Object} props - The parameters of the EditableTextBlock component.
 * @param {string} props.indexElement - The unique identifier of the element.
 * @param {Function} props.updateElementText - A function to update the text data of the element.
 * @param {Map<string, string>} props.indexDataMap - A mapping of element indexes to their textual content.
 * @param {string} props.focusElement - The identifier of the element currently in focus.
 * @param {Function} props.getPosition - A function to get the cursor position in the element's text.
 * @param {Function} props.setPositionCursor - A function to set the cursor position in the element's text.
 * @param {boolean} props.isReadonly - A flag indicating whether it is read-only.
 * @param {string} props.className - Additional style classes.
 *
 * @returns {JSX.Element} Returns a JSX element representing the editable text field.
 */
export const EditableTextBlock: React.FC<EditableTextBlockProps> = ({
	indexElement,
	updateElementText,
	indexDataMap,
	focusElement,
	getPosition,
	setPositionCursor,
	isReadonly,
	className

}) => {
	// Create a ref for accessing the textarea element
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	// Get the current cursor position
	const positionCursor = getPosition? getPosition(indexElement) : 0;
	// Set the focused element
	const focusEl= focusElement? focusElement : indexElement;
	// Get the text from the data map based on the element's index
	const data = indexDataMap.has(indexElement) ? indexDataMap.get(indexElement) : "";

	useEffect(()=>{
		// Set focus and cursor position when focus or position changes
		if(focusEl === indexElement){
			if(textareaRef !== null){
				if(textareaRef.current){
					const component = textareaRef.current;
					if(component){
						component.focus();
						if(component.selectionStart !== positionCursor){
							component.selectionStart = positionCursor;
							component.selectionEnd = positionCursor;
						}
					}
				}
			}
		}
	},[focusEl, positionCursor]);

	useEffect(() => {
		// Automatically set the textarea's height based on its content
		if (textareaRef.current) {
			const element = textareaRef.current;
			element.style.height = "1.1em";
			element.style.height = element.scrollHeight + "px";
		}
	}, [data]);

	/**
	 * Handler for changes in the textarea's content.
	 *
	 * @param {React.ChangeEvent<HTMLTextAreaElement>} e - The change event.
	 */
	function onChange(e: React.ChangeEvent<HTMLTextAreaElement>){
		const textarea = e.target as HTMLTextAreaElement;
		if(indexElement === focusEl){
			if (updateElementText !== undefined) {
				updateElementText(indexElement, e.target.value);
			}
			if (setPositionCursor !== undefined) {
				setPositionCursor(indexElement, textarea.selectionStart);
			}
		}
	};

	/**
	 * Handler for focusing on the textarea.
	 *
	 * @param {React.ChangeEvent<HTMLTextAreaElement>} e - The focus event.
	 */
	function onFocus(e: React.ChangeEvent<HTMLTextAreaElement>){
		const textarea = e.target as HTMLTextAreaElement;
		if(focusEl !== indexElement) {
			textarea.selectionStart = positionCursor;
			if (setPositionCursor) {
				//textarea.selectionStart = textarea.value.length;
				setPositionCursor(indexElement, positionCursor);
			}
		}
	};

	/**
	 * Handler for clicking on the textarea.
	 *
	 * @param {React.MouseEvent<HTMLTextAreaElement>} e - The click event.
	 */
	function onClick(e: React.MouseEvent<HTMLTextAreaElement>){
		const textarea = e.target as HTMLTextAreaElement;
		if(focusEl === indexElement){
			if (setPositionCursor) {
				setPositionCursor(indexElement, textarea.selectionStart);
			}
		}
	};

	/**
	 * Handler for key up events.
	 *
	 * @param {React.KeyboardEvent} e - The key up event.
	 */
	function onKeyUp(e: React.KeyboardEvent){
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
			const textarea = e.target as HTMLTextAreaElement;
			if(focusEl === indexElement){
				if (setPositionCursor) {
					setPositionCursor(indexElement, textarea.selectionStart);
				}
			}
		}
	};

	return (
		<div>
		  <textarea
			  readOnly={isReadonly}
			  ref={textareaRef}
			  onFocus={onFocus}
			  onChange={onChange}
			  onKeyUp={onKeyUp}
			  onClick={onClick}
			  className={`${style.dynamic_height_input} ${className}`}
			  value={data}/>
		</div>
	);
};