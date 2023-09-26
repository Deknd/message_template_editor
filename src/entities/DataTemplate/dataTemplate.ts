import {useState} from "react";

/**
 * A custom React hook for managing text data associated with elements using a Map.
 *
 * @param {Map<string, string>} startMap - An optional initial Map of element data.
 * @returns {[Map<string, string>, Function, Function]} - An array containing the current data Map,
 *   a function to update the text data for a specific element, and a function to replace the entire data Map.
 */
export function useElementDataMap(startMap?: Map<string,string> ){
	const [ indexDataMap, setElementDataMap ] = useState<Map<string,string>>(startMap? startMap : new Map());
	/**
	 * Update the text data for a specific element in the Map.
	 *
	 * @param {string} indexElement - The identifier of the element.
	 * @param {string} dataText - The text data to associate with the element.
	 */
	function updateElementText(indexElement: string, dataText: string){
		const newMap = new Map<string, string>(indexDataMap);
		newMap.set(indexElement, dataText);
		setElementDataMap(newMap);
	}
	return [indexDataMap, updateElementText, setElementDataMap] as const;

}
/**
 * Retrieve the text associated with a specific element from the Map.
 *
 * @param {string} indexElement - The identifier of the element.
 * @param {Map<string, string>} mapIndexData - The Map containing element data.
 * @returns {string} - The text associated with the specified element, or an empty string if not found.
 */
export function getTextForElement(indexElement: string, mapIndexData: Map<string, string>) {
	if (mapIndexData.has(indexElement)) {
		const focusText = mapIndexData.get(indexElement);
		if (focusText) {
			return focusText;
		}
	}
	return "";
}
