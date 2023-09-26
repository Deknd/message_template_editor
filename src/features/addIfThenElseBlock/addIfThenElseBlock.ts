import {SkeletonStructure} from "../../entities/sceletonStructure";
import {getTextForElement} from "../../entities/DataTemplate";

/**
 * Adds a new element to a template structure based on the provided cursor position.
 *
 * @param indexFocusElement - The index of the element that is in focus.
 * @param positionCursor - Position of the cursor in the focus element
 * @param indexDataMap - A map containing index-to-data mappings, where keys are element indices, and values are text data.
 * @param structComp - The original template structure.
 * @returns A tuple containing the following:
 *   - newStruct: A new template structure with the added element.
 *   - newMap: A new map with updated text data based on the cursor position.
 *   - newPosition: An object representing the updated cursor position after adding the element.
 */
export function addElement(
	indexFocusElement: string,
	positionCursor: number,
	indexDataMap: Map<string, string>,
	structComp: SkeletonStructure,
): [newStruct: SkeletonStructure, newMap: Map<string, string>, newPosition: { indexElement: string, positionCursor: number }] {
	console.log("pos: ",positionCursor)
	// Create a new template structure based on the original one.
	const struct = SkeletonStructure.getNewStruct(structComp);
	const arrayIndex = indexFocusElement.split(",").map(Number);
	// Find the parent element in the template structure.
	const parent = struct.findParentElementByPath(arrayIndex);
	let newMap = new Map<string, string>(indexDataMap);
	let newPosition: {
		indexElement: string;
		positionCursor: number;
	} = {indexElement: "0", positionCursor: 0};
	if (parent) {
		// Add a new block to the template structure based on the cursor position.
		parent.addBlockToParent(indexFocusElement);
		// Split the text and update the map based on the cursor position.
		newMap = splitText(indexFocusElement, positionCursor, newMap, parent);
		// Calculate and set the new cursor position after adding the element.
		newPosition = updatePositionWhenAddElement(indexFocusElement, parent);
	}
	return [struct, newMap, newPosition];
}

/**
 * Splits text within the focused element based on the cursor position when adding a new element to the structure.
 *
 * @param indexFocusElement - The index of the element in which the text should be split.
 * @param positionCursor - A function that returns the cursor position when given an element index.
 * @param indexDataMap - A map containing index-to-data mappings.
 * @param parent - The parent SkeletonStructure containing elements.
 * @returns A new map with index-based keys and updated text data based on the cursor position.
 */
function splitText(
	indexFocusElement: string,
	positionCursor: number,
	indexDataMap: Map<string, string>,
	parent: SkeletonStructure
): Map<string, string> {

	// Find the position of the focused element within the parent structure.
	const positionFocusElement = parent.findPositionElementInTemplateStructure(indexFocusElement);
	const children = parent.children;
	if (children) {
		const focusElement = children[positionFocusElement];
		// Check if the focused element does not belong to an "if" block.
		if (focusElement.block !== "if") {
			const newElement = children[positionFocusElement + 2];
			if (newElement) {
				const indexTwoElement = newElement.indexElement;
				if (indexTwoElement) {
					const indexTwoElementString = indexTwoElement.join(",");
					// Get the text from the focused element.
					const focusText = getTextForElement(indexFocusElement, indexDataMap);
					console.log("pos: ",positionCursor)

					const sliceBeforeCursor = focusText.slice(0, positionCursor);
					const sliceAfterCursor = focusText.slice(positionCursor);
					indexDataMap.set(indexFocusElement, sliceBeforeCursor);
					indexDataMap.set(indexTwoElementString, sliceAfterCursor);
				}
			}
		}
	}
	console.log(indexDataMap)
	return indexDataMap;
}

/**
 * Updates the cursor position when adding a new block to a template structure.
 *
 * @param focusIndexElement - The index of the currently focused element.
 * @param parentElement - The parent SkeletonStructure containing elements.
 * @returns An object with the new index of the element to which the cursor will be moved and the cursor position within that element (usually 0 for the start).
 */
function updatePositionWhenAddElement(focusIndexElement: string, parentElement: SkeletonStructure): {
	indexElement: string;
	positionCursor: number;
} {
	// Find the position of the focused element within the parent structure.
	const positionFocusElement = parentElement.findPositionElementInTemplateStructure(focusIndexElement);
	const children = parentElement.children;
	let correctPosition = 1;
	if (children) {
		const focusElement = children[positionFocusElement];
		// If the focused element belongs to an "if" block, adjust the position.
		if (focusElement.block !== null && focusElement.block === "if") {
			correctPosition++;
		}
		const newFocusElement = children[positionFocusElement + correctPosition];
		if (newFocusElement) {
			const newIndexParentFocus = newFocusElement.indexElement;
			if (newIndexParentFocus) {
				const resultIndex = Array.from(newIndexParentFocus);
				resultIndex.push(0);
				return {
					indexElement: resultIndex.join(","),
					positionCursor: 0
				};
			}
		}
	}
	// If no new element found, return the original focus index with cursor at the start.
	return {
		indexElement: focusIndexElement,
		positionCursor: 0
	};
}

