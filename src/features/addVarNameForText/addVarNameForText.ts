/**
 * Inserts a variable name into the text associated with a specific index element
 * at the specified cursor position and returns updated data.
 *
 * @param {string} varName - The variable name to be inserted.
 * @param {Map<string, string>} indexDataMap - The Map that stores text data associated with index elements.
 * @param {string} indexFocusElement - The index element to which the variable should be added.
 * @param {function(string): number} positionCursor - A function that determines the current cursor position
 *                                                    based on the specified index.
 * @returns {Object} - An object containing the updated data and the new cursor position.
 *
 * This function creates a new map, 'newIndexDataMap', as a copy of the input map 'indexDataMap'.
 * It then calls the 'insertVarNameIntoText' function to insert 'varName' into the text associated with
 * the specified 'indexFocusElement' using the provided 'positionCursor'. The updated data is stored in 'newIndexDataMap'.
 * The function also updates the cursor position by adding the length of 'varName' to the current position
 * returned by 'positionCursor'. Finally, it returns an object with the updated data ('updateData')
 * and the new cursor position ('newPositionCursor').
 */

export function addVarNameToTextWithPosition(
	varName: string,
	indexDataMap: Map<string, string>,
	indexFocusElement: string,
	positionCursor: number,
): { updateData: Map<string, string>, newPositionCursor: { indexElement: string, positionCursor: number } } {
	const newIndexDataMap = new Map(indexDataMap);
	let pos: number = 0;
	if (positionCursor < 0) {
		pos = 0;
	} else {
		if (newIndexDataMap.has(indexFocusElement)) {
			const lengthText = newIndexDataMap.get(indexFocusElement)!.length;
			if (lengthText < positionCursor) {
				pos = lengthText;
			} else {
				pos = positionCursor;
			}
		}
	}

	if (varName.length === 0) {
		return {updateData: newIndexDataMap, newPositionCursor: {indexElement: indexFocusElement, positionCursor: pos}};
	}
	insertVarNameIntoText(varName, newIndexDataMap, indexFocusElement, pos);

	const newPosition: { indexElement: string, positionCursor: number } = {
		indexElement: indexFocusElement,
		positionCursor: (pos + varName.length)
	};
	return {updateData: newIndexDataMap, newPositionCursor: newPosition};
}

/**
 * Inserts a variable name into the given text associated with a specific index element
 * at the specified cursor position.
 *
 * @param {string} varName - The variable name to be inserted.
 * @param {Map<string, string>} indexDataMap - The Map that stores text data associated with index elements.
 * @param {string} indexFocusElement - The index element to which the variable should be added.
 * @param {number} positionCursor - The cursor position specifying where to insert the variable name.
 *
 * This function inserts `varName` into the text associated with the provided `indexFocusElement` in the `indexDataMap`.
 * If the `indexFocusElement` does not exist in the map, a new entry is created with `varName`.
 * If the text for the `indexFocusElement` is empty or undefined, it is replaced with `varName`.
 * If the `positionCursor` is out of bounds, `varName` is appended to the end of the text.
 * Otherwise, `varName` is inserted at the specified `positionCursor` within the text.
 */
function insertVarNameIntoText(varName: string, indexDataMap: Map<string, string>, indexFocusElement: string, positionCursor: number) {
	if (!indexDataMap.has(indexFocusElement)) {
		indexDataMap.set(indexFocusElement, varName);
	} else {
		const existingData = indexDataMap.get(indexFocusElement);
		indexDataMap.set(indexFocusElement, existingData!.slice(0, positionCursor) + varName + existingData!.slice(positionCursor));
	}
}

