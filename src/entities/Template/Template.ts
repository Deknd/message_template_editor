import {isElement, SkeletonStructure} from "../sceletonStructure";

/**
 * The `Template` interface is intended for storing and using a message template.
 * This interface is used for serialization and deserialization of template data.
 */
export interface Template {

	/**
	 * An array of variable names used to create the message template.
	 */
	arrVarName: Array<string>;

	/**
	 * The structure of the message template.
	 */
	structure: SkeletonStructure;

	/**
	 * An array of arrays containing indices of elements and their corresponding text.
	 */
	indexDataArray: Array<Array<string>>;
}

/**
 * The `getTemplate` function creates a `Template` object based on the provided data.
 *
 * @param arrVarName - An array of variable names used to create the message template.
 * @param structure - The structure of the message template.
 * @param indexDataMap - Text data for the message template as a Map, where the key is the index of the element, and the value is the text of the element.
 * @returns The created `Template` object.
 */
export function getTemplate(arrVarName: Array<string>, structure: SkeletonStructure, indexDataMap: Map<string, string>): Template {
	const indexData_mapToArray = new Array<Array<string>>();
	indexDataMap.forEach((value, key) => {
		if (isElement(key, structure)) {

			indexData_mapToArray.push([key, value]);
		}
	});
	const uniqueVarName = new Set<string>();
	for (const [, value] of indexData_mapToArray) {
		value.split(/(\{[^}]+\})/).forEach(part => {
			const stringWithoutBraces = part.replace(/{|}/g, "");
			if (arrVarName.includes(stringWithoutBraces)) {
				uniqueVarName.add(stringWithoutBraces);
			}
		});

	}
	return {
		arrVarName: Array.from(uniqueVarName),
		structure: structure,
		indexDataArray: indexData_mapToArray
	};
}

