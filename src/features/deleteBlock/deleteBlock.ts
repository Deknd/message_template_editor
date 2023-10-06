import {SkeletonStructure} from "../../entities/sceletonStructure";
import {getTextForElement} from "../../entities/DataTemplate";

/**
 * This function deletes an element from a data structure, updates the index-to-data mapping,
 * and calculates the new cursor position after the deletion.
 *
 * @param {Array<number>} indexElement - The index of the element to be deleted.
 * @param {Map<string, string>} indexDataMap - A map where keys are element indexes and values are element data.
 * @param {SkeletonStructure} structComp - The main data structure.
 * @returns {[Map<string, string>, SkeletonStructure, { indexElement: string, positionCursor: number }]} - A tuple
 * containing the updated index-to-data map, the modified data structure, and the new cursor position.
 * @throws {Error} Throws an error if the structure is not valid at the top level, if the specified index is incorrect,
 * or if the specified element cannot be deleted.
 */
export function deleteBlock(
	indexElement: Array<number>,
	indexDataMap: Map<string, string>,
	structComp: SkeletonStructure,
): [Map<string, string>, SkeletonStructure, { indexElement: string, positionCursor: number }] {
	let newIndexDataMap = new Map<string, string>(indexDataMap);
	let newPosition: { indexElement: string, positionCursor: number } = {indexElement: "0", positionCursor: 0};
	if (!structComp.couldBeChildren) {
		throw new Error("The structure is not a valid top-level structure.");
	}

	if (structComp.children!.length < 1) {
		throw new Error("The structure is not a valid top-level structure.");
	}

	if (structComp.block !== null || structComp.indexElement !== null) {
		throw new Error("The structure is not a valid top-level structure.");
	}
	const newStruct = SkeletonStructure.getNewStruct(structComp);
	const parentFocusElement = newStruct.findParentElementByPath(indexElement);
	if (!parentFocusElement) {
		throw new Error("The index isn't correct.");
	}
	const positionDeleteElementForArray = parentFocusElement.findPositionElementInTemplateStructure(indexElement.join(","));
	if (positionDeleteElementForArray < 0) {
		throw new Error("The index isn't correct.");
	}
	const deleteElement = parentFocusElement.children![positionDeleteElementForArray];
	if (!deleteElement.couldBeChildren || deleteElement.children === null || deleteElement.indexElement === null) {
		throw new Error("The index isn't correct.");
	}

	glueText(indexElement, newIndexDataMap, parentFocusElement);
	const positionInArrayNewFocusElement = deleteElementEditStructure(indexElement, parentFocusElement);
	newPosition = updatingCoursePositionOnDeletionOnElement(positionInArrayNewFocusElement, newIndexDataMap, parentFocusElement);

	return [newIndexDataMap, newStruct, newPosition];
}

/**
 * This function combines text data from the element before and after the focused element in a data structure,
 * after removing the focused element, its children, and the element next to it.
 *
 * @param {Array<number>} deletionIndexElement - The index of the element to be deleted.
 * @param {Map<string, string>} newIndexDataMap - A map where keys are element indexes and values are element data.
 * @param {SkeletonStructure} parentFocusElement - The parent element containing the focused element,
 *        its children, and the next adjacent element.
 */
function glueText(deletionIndexElement: Array<number>, newIndexDataMap: Map<string, string>, parentFocusElement: SkeletonStructure) {
	const positionFocusElement = parentFocusElement.findPositionElementInTemplateStructure(deletionIndexElement.join(","));
	const children = parentFocusElement.children!;
	const elementThenRemains = children[positionFocusElement - 1];
	const elementThenDelete = children[positionFocusElement + 1];
	if (elementThenRemains && elementThenDelete) {
		const indexElementThenRemains = elementThenRemains.indexElement;
		const indexElementThenDelete = elementThenDelete.indexElement;
		if (indexElementThenRemains && indexElementThenDelete) {
			const sliceOneText = getTextForElement(indexElementThenRemains.join(","), newIndexDataMap);
			const sliceTwoText = getTextForElement(indexElementThenDelete.join(","), newIndexDataMap);
			newIndexDataMap.set(indexElementThenRemains.join(","), (sliceOneText + sliceTwoText));
			newIndexDataMap.delete(indexElementThenDelete.join(","));
			// Iterate over newMap keys to remove keys related to the deleted element.
			for (const key of newIndexDataMap.keys()) {
				const arrayKey = key.split(",").map(Number);
				// Check if the keys are associated with the deleted element using deletionIndexElement.
				if (arrayKey.length >= deletionIndexElement.length && deletionIndexElement.every((value, index) => arrayKey[index] === value)) {
					newIndexDataMap.delete(key);
				}
			}
		}
	}

}

/**
 * This function removes an element from a data structure and returns the index of the element
 * that will be the focus after the deletion.
 *
 * @param {Array<number>} indexElement - The index of the element to be deleted.
 * @param {SkeletonStructure} parentElement - The parent element containing the structure.
 * @returns {number} - The index of the element that will be focused after deletion.
 */
function deleteElementEditStructure(indexElement: Array<number>, parentElement: SkeletonStructure): number {
	const positionDeleteElement = parentElement.findPositionElementInTemplateStructure(indexElement.join(","));
	const children = parentElement.children!;
	children.splice(positionDeleteElement, 2);

	return positionDeleteElement - 1;
}

/**
 * This function updates the cursor position when an element is deleted from a structure.
 *
 * @param {number} positionNewFocusElementInArray - The new position of the focus element in the array.
 * @param {Map<string, string>} indexDataMap - A map containing index-to-data mappings.
 * @param {SkeletonStructure} parent - The parent structure.
 * @returns {{indexElement: string, positionCursor: number}} - An object containing the updated index and cursor position.
 */
function updatingCoursePositionOnDeletionOnElement(
	positionNewFocusElementInArray: number,
	indexDataMap: Map<string, string>,
	parent: SkeletonStructure,
): { indexElement: string, positionCursor: number } {
	const children = parent.children!;
	const focusElement = children[positionNewFocusElementInArray];
	const indexElement = focusElement.indexElement!;
	const indexElementToString = indexElement.join(",");
	const data = indexDataMap.has(indexElementToString) ? indexDataMap.get(indexElementToString)! : "";

	return {indexElement: indexElementToString, positionCursor: data.length};
}