import {isElement, SkeletonStructure} from "../../entities/sceletonStructure";
import {Template} from "../../entities/Template";

enum BlocType {
	TOP = "top",
	IF = "if",
	THEN = "then",
	ELSE = "else"
}

interface VarName {
	name: string;
	value: string;
}

/**
 * Generates a text message based on a given template and variable names.
 *
 * @param {Template} template - The template containing the structure and data for message generation.
 * @param {Object[]} varNames - An array of variable names mapped to their values.
 * @returns {string} - The generated text message.
 * @throws {Error} Throws an error if the template structure is invalid.
 */
export function messageGeneratorOnTemplate(template: Template, varNames: Object[]): string {
	const variableNames = canConvertToObjectArray(varNames);
	validationTemplate(template);
	const idDataMap = generationIdDataMap(template, variableNames);
	const tree = createTree(template.structure, idDataMap);
	return tree.generateText();
}

/**
 * Validates the template structure to ensure it conforms to expected rules.
 *
 * @param {Template} template - The template to validate.
 * @throws {Error} Throws an error if the template structure is invalid.
 */
const validationTemplate = (template: Template) => {
	const struct = template.structure;
	const indexData = template.indexDataArray;
	if (!struct.couldBeChildren) {
		throw new Error("Template is invalid because the root element has not children.");
	}

	if (struct.block !== null || struct.indexElement !== null) {
		throw new Error("Template is invalid because the root structure should not have a block or index.");
	}
	isStruct(struct);

	for (const [key,] of indexData) {
		if (!isElement(key, struct)) {
			throw new Error("Template is invalid because the data does not match the structure.");
		}
	}
};

/**
 * Recursively validates the structure of the SkeletonStructure.
 *
 * @param {SkeletonStructure} struct - The structure to validate.
 * @throws {Error} Throws an error if the structure is invalid.
 */
function isStruct(struct: SkeletonStructure) {
	const children = struct.children!;
	if (children.length < 1) {
		throw new Error(`Template is invalid because child elements must have at least one child.`);
	}
	const blockType = new Array<string>("else", "then", "if");
	for (const child of children) {
		if (!child.couldBeChildren) {
			if (child.block !== null) {
				const block = blockType.pop();
				if (block !== child.block) {
					throw new Error(`Template is invalid because the structure of child elements is not valid. Expected block ${block}, but found ${child.block}`);
				}
			}
			if (child.indexElement === null) {
				throw new Error(`Template is invalid because not all elements have an index.`);
			}
		} else {
			isStruct(child);
		}
	}
}

/**
 * The ObjectWithStrings interface represents objects where keys are strings and values are also strings.
 */
interface ObjectWithStrings {
	[key: string]: string;
}

/**
 * Checks whether the given object conforms to the ObjectWithStrings interface.
 *
 * @param {object} obj - The object to check.
 * @returns {boolean} - true if the object conforms to the ObjectWithStrings interface, otherwise false.
 */
function isObjectWithStrings(obj: object): obj is ObjectWithStrings {

	const keys = Object.keys(obj);
	return keys.every((key) => typeof (obj as ObjectWithStrings)[key] === "string");
}

/**
 * Filters an array of objects, keeping only those that conform to the ObjectWithStrings interface.
 *
 * @param {object[]} varNames - The array of objects to filter.
 * @returns {ObjectWithStrings[]} - An array of objects that conform to the ObjectWithStrings interface.
 */
function canConvertToObjectArray(varNames: object[]): ObjectWithStrings[] {
	return varNames.filter((obj) => isObjectWithStrings(obj)) as ObjectWithStrings[];
}


/**
 * Recursively processes a SkeletonStructure, building a hierarchical TreeText structure.
 *
 * @param {SkeletonStructure} structure - The structure to process.
 * @param {Map<string, (string | VarName)[]>} idDataMap - A map containing data based on IDs.
 * @returns {TreeText | null} - The root node of the generated TreeText hierarchy, or null if no child nodes are created.
 */
function createTree(structure: SkeletonStructure, idDataMap: Map<string, (string | VarName)[]>) {
	const children = structure.children!;
	const top = new TreeText(BlocType.TOP, null, null, new Array<TreeText>(), null);
	children.forEach(struct => {
		const childrenThen = top.childrenThen!;
		if (!struct.couldBeChildren) {
			const id = struct.indexElement!;
			const idString = id.join(",");
			const data = idDataMap.get(idString)!;
			childrenThen.push(new TreeText(null, id, data, null, null));
		} else {
			const treeChild = treeRound(struct, idDataMap)!;
			childrenThen.push(treeChild);
		}
	});
	return top;
}

/**
 * Recursively processes the tree structure, building a TreeText hierarchy based on the provided structure and data.
 *
 * @param {SkeletonStructure} structure - The structure to process.
 * @param {Map<string, (string | VarName)[]>} idDataMap - A map containing data based on IDs.
 * @returns {TreeText | null} - The root node of the generated TreeText hierarchy, or null if no child nodes are created.
 */
function treeRound(structure: SkeletonStructure, idDataMap: Map<string, (string | VarName)[]>): TreeText {
	const children = structure.children!;
	let child: TreeText;
	let isBlock: BlocType;
	children.forEach(struct => {
			const block = struct.block;
			const couldBeChildren = struct.couldBeChildren;
			if (!couldBeChildren) {
				if (block !== null) {
					if (block === BlocType.IF) {
						const id = struct.indexElement!;
						const idString = id.join(",");
						const data = idDataMap.get(idString)!;
						child = new TreeText(BlocType.IF, id, data, new Array<TreeText>(), new Array<TreeText>());
					}
					if (block === BlocType.THEN) {
						pushTree(child!, struct, idDataMap, BlocType.THEN);
						isBlock = BlocType.THEN;
					}
					if (block === BlocType.ELSE) {
						pushTree(child!, struct, idDataMap, BlocType.ELSE);
						isBlock = BlocType.ELSE;
					}
				} else {
					if (isBlock === BlocType.THEN) {
						pushTree(child!, struct, idDataMap, BlocType.THEN);
					}
					if (isBlock === BlocType.ELSE) {
						pushTree(child!, struct, idDataMap, BlocType.ELSE);
					}
				}
			} else {
				childPushTree(struct, idDataMap, child!, isBlock);
			}
		}
	);
	return child!;
}


function childPushTree(struct: SkeletonStructure, idDataMap: Map<string, (string | VarName)[]>, child: TreeText, isBlock: BlocType) {
	const treeChildText = treeRound(struct, idDataMap);
	if (isBlock === BlocType.THEN) {
		const childArray = child.childrenThen!;
		childArray.push(treeChildText);
	}
	if (isBlock === BlocType.ELSE) {
		const childArray = child.childrenElse!;
		childArray.push(treeChildText);
	}
}


/**
 * Adds child nodes to a given parent node based on the provided ID data map.
 *
 * @param {TreeText | null} child - The child node to add, can be null.
 * @param {SkeletonStructure} struct - The structure to which child nodes are added.
 * @param {Map<string, (string | VarName)[]>} idDataMap - A map containing data based on IDs.
 * @param {BlocType} block - The block type to set for the added child nodes.
 */
function pushTree(child: TreeText, struct: SkeletonStructure, idDataMap: Map<string, (string | VarName)[]>, block: BlocType) {
	let childrenBlock;
	if (block === BlocType.THEN) {
		childrenBlock = child.childrenThen;
	} else {
		childrenBlock = child.childrenElse;
	}
	const id = struct.indexElement!;
	const idString = id.join(",");
	const data = idDataMap.get(idString)!;
	childrenBlock!.push(new TreeText(block, id, data, null, null));
}

/**
 * Represents a structured text block that can be part of a hierarchical tree.
 * Each instance of this class can have a block type, an optional ID, text data, and child nodes.
 * It provides a method to generate text content based on its structure and block type.
 */
class TreeText {
	blockType: BlocType | null;
	id: Array<number> | null;
	textData: Array<string | VarName> | null;
	childrenThen: Array<TreeText> | null;
	childrenElse: Array<TreeText> | null;

	/**
	 * Creates an instance of the TreeText class.
	 *
	 * @param {BlocType | null} block - The block type of the TreeText.
	 * @param {Array<number> | null} id - An optional array of numbers representing an ID.
	 * @param {Array<string | VarName> | null} data - An optional array of text or VarName objects.
	 * @param {Array<TreeText> | null} childrenThen - An optional array of child TreeText nodes for the "then" block.
	 * @param {Array<TreeText> | null} childrenElse - An optional array of child TreeText nodes for the "else" block.
	 */
	constructor(block: BlocType | null, id: Array<number> | null, data: Array<string | VarName> | null, childrenThen: Array<TreeText> | null, childrenElse: Array<TreeText> | null) {
		this.blockType = block;
		this.id = id;
		this.textData = data;
		this.childrenElse = childrenElse;
		this.childrenThen = childrenThen;
	}

	/**
	 * Generates text content based on the structure of the TreeText object.
	 * Depending on the block type, it recursively collects text data from children nodes or text data within the node.
	 * For "top" block type, it accumulates text from the "childrenThen" nodes.
	 * For "then" or "else" block types, it accumulates text from the "textData" array.
	 * For "if" block type, it checks the condition text in "textData" and accumulates text from "childrenThen" if the condition is true,
	 * or from "childrenElse" if the condition is false.
	 *
	 * @returns {string} - The generated text content.
	 */
	generateText(): string {
		const text = new Array<string>();
		if (this.blockType === BlocType.TOP) {
			this.childrenThen!.forEach(child => {
				text.push(child.generateText());
			});
		}
		if (this.blockType === null || this.blockType === BlocType.THEN || this.blockType === BlocType.ELSE) {
			this.textData!.forEach(textVarName => {
				if (typeof textVarName === "string") {
					text.push(textVarName);
				} else {
					text.push(textVarName.value);
				}
			});
		}
		if (this.blockType === BlocType.IF) {
			const conditionText = new Array<string>();
			this.textData!.forEach(textVarName => {
				if (typeof textVarName === "string") {
					conditionText.push(textVarName);
				} else {
					conditionText.push(textVarName.value);
				}
			});
			if (conditionText.join("").length !== 0) {
				this.childrenThen!.forEach(child => {
					text.push(child.generateText());
				});
			} else {
				this.childrenElse!.forEach(child => {
					text.push(child.generateText());
				});
			}
		}
		return text.join("");
	}
}


/**
 * Generates a map of ID data based on a template and variable names.
 *
 * @param {Template} template - The template object containing data and structure.
 * @param {Array<{ [p: string]: string }>} varNames - An array of objects representing key-value pairs for variable names.
 * @returns {Map<string, (string | VarName)[]>} - A map with keys representing IDs and values containing an array of text and VarName objects.
 */
function generationIdDataMap(template: Template, varNames: ObjectWithStrings[]): Map<string, (string | VarName)[]> {
	const indexDataMap = new Map<string, string>();
	for (const [key, value] of template.indexDataArray) {
		indexDataMap.set(key, value);
	}
	const arrayChildren = template.structure.children!;
	const orderElementsArray = flattenStructureToArray(arrayChildren);
	const nameVarNameMap = createIndexVarName(varNames, template);
	return createIdDataMapFromIndex(orderElementsArray, indexDataMap, nameVarNameMap);
}

/**
 * Converts a hierarchical structure into an array to extract the order in which elements should be displayed.
 * @param {Array<SkeletonStructure>} arrayChildren - An array of SkeletonStructure representing the hierarchical structure.
 * @returns {Array<Array<number>>} - An array containing the order of elements.
 * @throws {Error} If the input is not an array or if any element in the array is invalid.
 */
function flattenStructureToArray(arrayChildren: Array<SkeletonStructure>): Array<Array<number>> {
	const resultArray = new Array<Array<number>>();
	for (const child of arrayChildren) {
		flattenChildElement(child, resultArray);
	}
	return resultArray;
}

/**
 * Recursively processes a child element of the structure and adds its index to the resultArray if it cannot have children.
 * @param {SkeletonStructure} childElement - The child element of the structure.
 * @param {Array<Array<number>>} resultArray - The array to store the order of elements.
 * @throws {Error} If the childElement is invalid or contains unexpected data.
 */
function flattenChildElement(childElement: SkeletonStructure, resultArray: Array<Array<number>>) {
	if (!childElement.couldBeChildren) {
		const index = childElement.indexElement!;
		resultArray.push(index);
	} else {
		const arrayChildren = childElement.children!;
		for (const subChildElement of arrayChildren) {
			flattenChildElement(subChildElement, resultArray);
		}
	}
}

/**
 * Creates a variable map based on provided variable names and a template.
 * @param {Array<{ [p: string]: string }>} varNames - An array of objects representing key-value pairs where keys are variable names and values are their values.
 * @param {Template} template - The template object containing reference variable names.
 * @returns {Map<string, VarName>} - A map containing variables and their values.
 * @throws {Error} If the input is not an array or if any element in the array is invalid.
 */
function createIndexVarName(varNames: ObjectWithStrings[], template: Template) {
	let arrVarNamesForTemplate = Array.from(template.arrVarName);
	const resultVarNameArray = varNames.map((varName) => {
		const key = Object.keys(varName)[0];
		const foundVarName = arrVarNamesForTemplate.find((vn) => {
			if (key === vn) {
				arrVarNamesForTemplate = arrVarNamesForTemplate.filter(item => item !== vn);
				return true;
			} else {
				return false;
			}
		});
		if (foundVarName !== undefined) {
			return varName;
		}
		return null;
	}).filter((varName): varName is ObjectWithStrings => varName !== null);
	if (arrVarNamesForTemplate.length > 0) {
		const variableForTemplate = arrVarNamesForTemplate.map(item => {
			return {[item]: ""};
		});
		variableForTemplate.forEach(varName => {
			resultVarNameArray.push(varName);
		});
	}
	return createVarNameMap(resultVarNameArray);
}

/**
 * Creates a variable map from an array of objects representing key-value pairs.
 *
 * @param {Array<{ [p: string]: string }>} variables - An array of objects where each object represents a single key-value pair.
 * @returns {Map<string, VarName>} - A map containing variables and their corresponding VarName objects.
 * @throws {Error} If the input is not an array or if any element in the array is invalid.
 */
function createVarNameMap(variables: ObjectWithStrings[]) {
	const variableMap = new Map<string, VarName>();
	variables.forEach((variable) => {
		const [key] = Object.keys(variable);
		const value = variable[key];
		variableMap.set("{" + key + "}", {name: key, value: value});
	});
	return variableMap;
}

/**
 * Creates a mapping of data indices to arrays of text and VarName objects.
 * Variables are derived from the provided text.
 *
 * @param {Array<Array<number>>} orderArray - An array containing data indices, arranged in the desired display order.
 * @param {Map<string, string>} indexDataMap - A map associating data indices with corresponding data.
 * @param {Map<string, VarName>} nameVariableMap - A map associating variable names with VarName objects.
 * @returns {Map<string, (string | VarName)[]>} - A map associating data indices with arrays containing text and VarName objects.
 */
function createIdDataMapFromIndex(orderArray: number[][], indexDataMap: Map<string, string>, nameVariableMap: Map<string, VarName>): Map<string, (string | VarName)[]> {
	const idDataMap = new Map<string, Array<string | VarName>>();
	for (let i = 0; i < orderArray.length; i++) {
		const key = orderArray[i].join(",");
		if (indexDataMap.has(key)) {
			const text = indexDataMap.get(key)!;
			idDataMap.set(key, replaceTextWithVariables(nameVariableMap, text));
		} else {
			idDataMap.set(key, [""]);
		}
	}
	return idDataMap;
}

/**
 * Searches for curly braces in the input text and replaces them with corresponding variables from the provided variable map.
 * If a variable exists in the map, it is replaced; otherwise, the text remains unchanged.
 * Finally, it filters and removes undefined values from the result.
 *
 * @param {Map<string, VarName>} variableMap - A map containing variable placeholders as keys and their corresponding VarName objects as values.
 * @param {string} text - The input text to process.
 * @returns {Array<string | VarName>} - An array of strings and VarName objects after replacing variables.
 */
function replaceTextWithVariables(variableMap: Map<string, VarName>, text: string): Array<string | VarName> {
	const data = text.split(/(\{[^}]+\})/).map(part => {
		if (variableMap.has(part)) {
			return variableMap.get(part);
		} else {
			return part;
		}
	});
	const filteredParts = data.filter(part => part !== undefined);
	return filteredParts as Array<string | VarName>;
}
