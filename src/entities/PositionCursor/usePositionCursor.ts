import {useState} from "react";


/**
 * The `usePositionCursor` hook provides functions for managing cursor positions.
 * It allows you to set, get, and delete cursor positions for various elements.
 *
 * @returns {[string, Function, Function, Function]} An array containing the index of the current element in focus,
 * a function for getting cursor position, a function for setting cursor position, and a function for deleting cursor position.
 */
export function usePositionCursor() {

	/**
	 * Represents the current cursor state, including the index of the focused element
	 * and a map of cursor positions for different elements.
	 */
	interface CursorState {
		indexElement: string;
		positionCursor: Map<string, number>;

	}

	const [dataCursor, setDataCursor] = useState<CursorState>({
		indexElement: "0",
		positionCursor: new Map().set("0", 0)
	});

	/**
	 * The `setPosition` function sets the cursor position for the specified element.
	 *
	 * @param {string} indexElement The index of the element for which the cursor position is set.
	 * @param {number} position The new cursor position.
	 */
	function setPosition(indexElement: string, position: number) {
		const newMap = new Map(dataCursor.positionCursor);
		newMap.set(indexElement, position);
		setDataCursor({indexElement: indexElement, positionCursor: newMap});
	}

	/**
	 * The `getPosition` function returns the current cursor position for the specified element.
	 *
	 * @param {string} indexElement The index of the element for which the cursor position is needed.
	 * @returns {number} The current cursor position for the specified element.
	 */
	function getPosition(indexElement: string) {
		let positionCursor = 0;
		if (dataCursor.positionCursor.has(indexElement)) {
			const dataForMap = dataCursor.positionCursor.get(indexElement);
			if (dataForMap) {
				positionCursor = dataForMap;
			}
		}
		return positionCursor;
	}

	const cursorElementIndex = dataCursor.indexElement;

	/**
	 * The `deletePosition` function removes cursor position information.
	 *
	 * @param {number[]} indexFocusElement The index of the element for which the position is deleted.
	 *                                    Pass an empty array to delete positions for all elements.
	 * @param {string} indexElementNewFocus The index of the element to which focus will be set after deleting the position.
	 * @param {number} newPosition The new cursor position for the element to which focus will be set.
	 */
	function deletePosition(indexFocusElement: Array<number>, indexElementNewFocus: string, newPosition: number) {
		const newMap = new Map(dataCursor.positionCursor);
		for (const key of newMap.keys()) {
			const arrayKey = key.split(",").map(Number);
			// Check if the keys are associated with the deleted element using deletionIndexElement.
			if (arrayKey.length >= indexFocusElement.length && indexFocusElement.every((value, index) => arrayKey[index] === value)) {
				newMap.delete(key);
			}
		}
		newMap.set(indexElementNewFocus, newPosition);
		setDataCursor({indexElement: indexElementNewFocus, positionCursor: newMap});
	}

	return [cursorElementIndex, getPosition, setPosition, deletePosition] as const;
}

