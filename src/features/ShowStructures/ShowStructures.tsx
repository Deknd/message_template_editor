import React from "react";

import {SkeletonStructure} from "../../entities/sceletonStructure";
import {EditableTextBlock} from "../../entities/EditableTextBlock";

import {IfThenElse} from "./IfThenElse";

interface ShowStructuresProps {
	componentsArray: Array<SkeletonStructure | null> | null;
	mapIndexData: Map<string, string>;
	updateElementText: (indexElement: string, dataText: string) => void;
	focusElement: string;
	getPosition: (indexElement: string) => number;
	setPositionCursor: (indexElement: string, positionCursor: number) => void;
	deleteBlock: (indexElement: Array<number>) => void;
}

/**
 * The ShowStructures component is responsible for rendering the structure of a message template.
 * It displays child elements, and if a child can have further nested elements, it renders them using the IfThenElse component recursively.
 *
 * @param {Object} props - The props for the ShowStructures component.
 * @param {Array<SkeletonStructure | null> | null} props.componentsArray - An array of child elements in the message template structure.
 * @param {Map<string, string>} props.mapIndexData - A map associating element IDs with textual information.
 * @param {(indexElement: string, dataText: string) => void} props.updateElementText - A function for setting data for an element in the structure.
 * @param {string} props.focusElement - The ID of the element currently in focus.
 * @param {(indexElement: string) => number} props.getPosition - A function for getting the cursor position within the text of an element.
 * @param {(indexElement: string, positionCursor: number) => void} props.setPositionCursor - A function for setting the cursor position within the text of an element.
 * @param {(indexElement: Array<number>) => void} props.deleteBlock - A function for deleting an IfThenElse block and the subsequent EditableTextBlock block.
 *
 * @returns {JSX.Element} Returns a JSX element representing the display of the message template structure.
 */
export const ShowStructures: React.FC<ShowStructuresProps> = ({
	componentsArray,
	mapIndexData,
	updateElementText,
	focusElement,
	getPosition,
	setPositionCursor,
	deleteBlock
}) => {
	const array = componentsArray || [];
	return (
		<div>
			{array.map((element, index: number) => {
				if (element === null) {
					return null;
				}
				if (!element.couldBeChildren && element.indexElement !== null) {
					return (
						<EditableTextBlock
							key={`${index}${element.indexElement.join(",")}show`}
							indexDataMap={mapIndexData}
							updateElementText={updateElementText}
							indexElement={element.indexElement.join(",")}
							focusElement={focusElement}
							getPosition={getPosition}
							setPositionCursor={setPositionCursor}/>
					);
				} else {
					if (element.couldBeChildren && element.indexElement !== null) {
						return (
							< IfThenElse
								key={`${index}${element.indexElement.join(",")}show`}
								elementId={element.indexElement}
								childElements={element.children}
								deleteBlock={deleteBlock}
								indexDataMap={mapIndexData}
								updateElementText={updateElementText}
								focusElement={focusElement}
								getPosition={getPosition}
								setPositionCursor={setPositionCursor}
							/>
						);
					}
				}
			})
			}
		</div>
	);
};