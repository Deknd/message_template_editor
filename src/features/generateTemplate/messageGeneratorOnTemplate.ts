import {SkeletonStructure} from "../../entities/sceletonStructure";
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
 */
export function messageGeneratorOnTemplate(template: Template, varNames: { [p: string]: string }[]): string {

	// Generate the ID data map based on the template and variable names.
	const idDataMap = generationIdDataMap(template, varNames);

	// Create a tree structure from the template's skeleton structure and ID data map.
	const tree = createTree(template.structure, idDataMap);

	// Generate the text message by traversing the tree structure.
	return tree.generateText();
}

/**
 * Recursively processes a SkeletonStructure, building a hierarchical TreeText structure.
 *
 * @param {SkeletonStructure} structure - The structure to process.
 * @param {Map<string, (string | VarName)[]>} idDataMap - A map containing data based on IDs.
 * @returns {TreeText | null} - The root node of the generated TreeText hierarchy, or null if no child nodes are created.
 */
function createTree(structure: SkeletonStructure, idDataMap: Map<string, (string | VarName)[]>) {
	const children = structure.children;
	// Create the top-level TreeText node with the "TOP" block type.
	const top = new TreeText(BlocType.TOP, null, null, new Array<TreeText>(), null);
	if (children !== null) {
		children.forEach(struct => {
			const childrenThen = top.childrenThen;
			if (childrenThen) {
				if (!struct.couldBeChildren) {
					// If the current structure cannot have children, it represents a leaf node.
					// Extract its ID and look up corresponding data in the idDataMap.
					const id = struct.indexElement;
					if (id) {
						const idString = id.join(",");
						if (idDataMap.has(idString)) {
							const data = idDataMap.get(idString);
							if (data) {
								// Create a new TreeText node and add it as a child.
								childrenThen.push(new TreeText(null, id, data, null, null));
							}
						}
					}
				} else {
					// If the current structure can have children, recursively build the subtree.
					const treeChild = treeRound(struct, idDataMap);
					if (treeChild) {
						// Add the generated subtree as a child.
						childrenThen.push(treeChild);
					}
				}
			}
		});
	}
	// Return the top-level TreeText node representing the generated hierarchy.
	return top;
}

/**
 * Recursively processes the tree structure, building a TreeText hierarchy based on the provided structure and data.
 *
 * @param {SkeletonStructure} structure - The structure to process.
 * @param {Map<string, (string | VarName)[]>} idDataMap - A map containing data based on IDs.
 * @returns {TreeText | null} - The root node of the generated TreeText hierarchy, or null if no child nodes are created.
 */
function treeRound(structure: SkeletonStructure, idDataMap: Map<string, (string | VarName)[]>): TreeText | null {
	const children = structure.children;
	let child: TreeText | null = null;
	let isBlock: BlocType;
	if (children !== null) {
		children.forEach(struct => {
				const block = struct.block;
				const couldBeChildren = struct.couldBeChildren;
				if (!couldBeChildren) {
					if (block !== null) {
						if (block === BlocType.IF) {
							// If the current structure represents a leaf node (cannot have children).
							const id = struct.indexElement;
							if (id) {
								const idString = id?.join(",");
								if (idDataMap.has(idString)) {
									const data = idDataMap.get(idString);
									if (data) {
										child = new TreeText(BlocType.IF, id, data, new Array<TreeText>(), new Array<TreeText>());
									}
								}
							}
						}
						if (block === BlocType.THEN) {
							// Handle "THEN" block: delegate to pushTree function.
							pushTree(child, struct, idDataMap, BlocType.THEN);
							isBlock = BlocType.THEN;
						}
						if (block === BlocType.ELSE) {
							// Handle "ELSE" block: delegate to pushTree function.
							pushTree(child, struct, idDataMap, BlocType.ELSE);
							isBlock = BlocType.ELSE;
						}
					} else {
						// Handle a scenario where a block type is missing.
						if (isBlock === BlocType.THEN) {
							// If the previous block was "THEN," delegate to pushTree function.
							pushTree(child, struct, idDataMap, BlocType.THEN);
						}
						if (isBlock === BlocType.ELSE) {
							// If the previous block was "ELSE," delegate to pushTree function.
							pushTree(child, struct, idDataMap, BlocType.ELSE);
						}
					}
				} else {
					// If the current structure can have children, and there's already a child node.
					if (child) {
						// Delegate to childPushTree function to process child nodes.
						childPushTree(struct, idDataMap, child, isBlock);
					}
				}
			}
		);
	}
	// Return the child node or null if no child nodes were created.
	return child ? child : null;
}


function childPushTree(struct: SkeletonStructure, idDataMap: Map<string, (string | VarName)[]>, child: TreeText, isBlock: BlocType) {
	// Recursively process the current structure to generate a TreeText node.
	const treeChildText = treeRound(struct, idDataMap);
	if (treeChildText !== null) {
		// Check the block type of the parent node and append the generated child node accordingly.
		if (isBlock === BlocType.THEN) {
			const childArray = child.childrenThen;
			if (childArray) {
				childArray.push(treeChildText);
			}
		}
		if (isBlock === BlocType.ELSE) {
			const childArray = child.childrenElse;
			if (childArray) {
				childArray.push(treeChildText);
			}
		}
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
function pushTree(child: TreeText | null, struct: SkeletonStructure, idDataMap: Map<string, (string | VarName)[]>, block: BlocType) {
	if (child !== null) {
		let childrenBlock;
		// Determine the appropriate child array based on the provided block type.
		if (block === BlocType.THEN) {
			childrenBlock = child.childrenThen;
		} else {
			childrenBlock = child.childrenElse;
		}
		if (childrenBlock) {
			const id = struct.indexElement;
			if (id) {
				const idString = id.join(",");
				if (idDataMap.has(idString)) {
					const data = idDataMap.get(idString);
					if (data) {
						// Create a new TreeText node with the specified block type, ID, data, and null child arrays.
						childrenBlock.push(new TreeText(block, id, data, null, null));
					}
				}
			}
		}
	}
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

		// Process "top" block type.
		if (this.blockType === BlocType.TOP) {
			this.childrenThen?.forEach(child => {
				if (child !== null) {
					text.push(child.generateText());
				}
			});
		}

		// Process "then" or "else" block types.
		if (this.blockType === null || this.blockType === BlocType.THEN || this.blockType === BlocType.ELSE) {
			this.textData?.forEach(textData => {
				if (typeof textData === "string") {
					text.push(textData);
				} else {
					text.push(textData.value);
				}
			});
		}

		// Process "if" block type.
		if (this.blockType === BlocType.IF) {
			const conditionText = new Array<string>();
			this.textData?.forEach(textData => {
				if (typeof textData === "string") {
					conditionText.push(textData);
				} else {
					conditionText.push(textData.value);
				}
			});
			if (conditionText.join("").length !== 0) {
				this.childrenThen?.forEach(child => {
					text.push(child.generateText());
				});
			} else {
				this.childrenElse?.forEach(child => {
					text.push(child.generateText());
				});
			}
		}
		return text.length > 0 ? text.join("") : "";
	}
}


/**
 * Generates a map of ID data based on a template and variable names.
 *
 * @param {Template} template - The template object containing data and structure.
 * @param {Array<{ [p: string]: string }>} varNames - An array of objects representing key-value pairs for variable names.
 * @returns {Map<string, (string | VarName)[]>} - A map with keys representing IDs and values containing an array of text and VarName objects.
 */
function generationIdDataMap(template: Template, varNames: { [p: string]: string }[]) {
	// Create a map for quick access to index data.
	const indexDataMap = new Map<string, string>();
	for (const [key, value] of template.indexDataArray) {
		indexDataMap.set(key, value);
	}
	const arrayChildren = template.structure.children;
	if (arrayChildren === null) {
		return new Map<string, Array<string | VarName>>();
	}
	// Flatten the structure into a linear array.
	const orderElementsArray = flattenStructureToArray(arrayChildren);
	// Create a map of variable names indexed by their corresponding IDs.
	const nameVarNameMap = createIndexVarName(varNames, template);
	// Generate the final ID data map based on the flattened structure, index data, and variable names.
	return createIdDataMapFromIndex(orderElementsArray, indexDataMap, nameVarNameMap);
}

	/**
	 * Converts a hierarchical structure into an array to extract the order in which elements should be displayed.
	 * @param {Array<SkeletonStructure>} arrayChildren - An array of SkeletonStructure representing the hierarchical structure.
	 * @returns {Array<Array<number>>} - An array containing the order of elements.
	 * @throws {Error} If the input is not an array or if any element in the array is invalid.
	 */
	function flattenStructureToArray(arrayChildren: Array<SkeletonStructure>): Array<Array<number>> {
		if (!Array.isArray(arrayChildren)) {
			throw new Error("Input must be an array.");
		}
		const resultArray = new Array<Array<number>>();
		// Iterate through each child element in the hierarchical structure and flatten it.
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
	if (!childElement || typeof childElement !== "object") {
		throw new Error("Invalid child element found.");
	}

	// If the childElement cannot have children, extract its index and add it to the resultArray.
	if (!childElement.couldBeChildren) {
		const index = childElement.indexElement;
		if (Array.isArray(index)) {
			resultArray.push(index);
		} else {
			throw new Error("Invalid index element found in child element.");
		}
	} else {
		// If the childElement can have children, recursively process its children elements.
		const arrayChildren = childElement.children;
		if (Array.isArray(arrayChildren)) {
			for (const subChildElement of arrayChildren) {
				flattenChildElement(subChildElement, resultArray);
			}
		} else {
			throw new Error("Invalid children element found in child element.");
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
function createIndexVarName(varNames: { [p: string]: string }[], template: Template) {
	const resultVarNameArray = varNames.map((varName) => {
		const key = Object.keys(varName)[0];
		const foundVarName = template.arrVarName.find((vn) => key === vn);
		if (foundVarName !== undefined) {
			return varName;
		}
		return null;
	}).filter((varName): varName is { [p: string]: string } => varName !== null);
	// Create a variable map using the filtered 'resultVarNameArray'.
	return createVarNameMap(resultVarNameArray);
}

/**
 * Creates a variable map from an array of objects representing key-value pairs.
 *
 * @param {Array<{ [p: string]: string }>} variables - An array of objects where each object represents a single key-value pair.
 * @returns {Map<string, VarName>} - A map containing variables and their corresponding VarName objects.
 * @throws {Error} If the input is not an array or if any element in the array is invalid.
 */
function createVarNameMap(variables: ({ [p: string]: string } | undefined)[]) {
	if (!Array.isArray(variables)) {
		throw new Error("Input must be an array.");
	}
	const variableMap = new Map<string, VarName>();
	variables.forEach((variable) => {
		if (typeof variable === "object" && Object.keys(variable).length === 1) {
			const [key] = Object.keys(variable);
			const value = variable[key];
			variableMap.set("{" + key + "}", {name: key, value: value});
		} else {
			throw new Error("Invalid element found in the input array. Each element should be an object with a single key-value pair.");
		}
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
			const text = indexDataMap.get(key);
			if (text !== undefined) {
				// Replace variables in the 'text' using 'nameVariableMap' and store the result in 'idDataMap' under the 'key'.
				idDataMap.set(key, replaceTextWithVariables(nameVariableMap, text));
			}
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
