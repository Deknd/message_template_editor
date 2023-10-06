import {isElement, SkeletonStructure} from "../../entities/sceletonStructure";
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
 * * @throws Error if the provided structure is invalid or if there's an issue with the input data.
 */
export function addElement(
	indexFocusElement: string,
	positionCursor: number,
	indexDataMap: Map<string, string>,
	structComp: SkeletonStructure,
): [newStruct: SkeletonStructure, newMap: Map<string, string>, newPosition: { indexElement: string, positionCursor: number }] {
	if (!structComp.couldBeChildren) {
		throw new Error("The provided structure is not a top-level structure because top-level structures have children.");
	}

	if (structComp.children!.length < 1) {
		throw new Error("The provided structure is not a top-level structure because top-level structures should have at least one child.");
	}

	if (structComp.block !== null || structComp.indexElement !== null) {
		throw new Error("The provided structure is not a top-level structure because it cannot have a block or an index.");
	}
	if (!isElement(indexFocusElement, structComp)) {
		throw new Error("The index does not match this structure.");
	}
	const struct = SkeletonStructure.getNewStruct(structComp);
	const arrayIndex = indexFocusElement.split(",").map(Number);
	const parent = struct.findParentElementByPath(arrayIndex);
	let newMap = new Map<string, string>(indexDataMap);
	let newPosition: {
		indexElement: string;
		positionCursor: number;
	} = {indexElement: "0", positionCursor: 0};
	if (parent) {
		parent.addBlockToParent(indexFocusElement);
		newMap = splitText(indexFocusElement, positionCursor, newMap, parent);
		const isNewPosition = updatePositionWhenAddElement(indexFocusElement, parent);
		if (isNewPosition) {
			newPosition = isNewPosition;
		}
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

	const positionFocusElement = parent.findPositionElementInTemplateStructure(indexFocusElement);
	const children = parent.children;
	if (children) {
		const focusElement = children[positionFocusElement];
		if (focusElement.block !== "if") {
			const newElement = children[positionFocusElement + 2];
			if (newElement) {
				const indexTwoElement = newElement.indexElement;
				if (indexTwoElement !== null) {
					const indexTwoElementString = indexTwoElement.join(",");
					const focusText = getTextForElement(indexFocusElement, indexDataMap);
					const sliceBeforeCursor = focusText.slice(0, positionCursor);
					const sliceAfterCursor = focusText.slice(positionCursor);
					indexDataMap.set(indexFocusElement, sliceBeforeCursor);
					indexDataMap.set(indexTwoElementString, sliceAfterCursor);
				}
			}
		}
	}
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
} | undefined {
	const positionFocusElement = parentElement.findPositionElementInTemplateStructure(focusIndexElement);
	const children = parentElement.children;
	let correctPosition = 1;
	if (children) {
		const focusElement = children[positionFocusElement];
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
}

