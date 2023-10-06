

/**
 * The `SkeletonStructure` class represents the structure of a message template and manages it.
 */
export class SkeletonStructure {

	private childCount: number; // Counter for children of the current structure.
	public readonly couldBeChildren: boolean;
	public readonly indexElement: Array<number> | null;
	public readonly block: string | null;
	public children: Array<SkeletonStructure> | null;

	/**
	 * Creates a new `SkeletonStructure`.
	 * @param couldBeChildren A marker indicating whether the current structure can have children.
	 * @param indexElement The index of the element or null if the index is not defined.
	 * @param children An array of children or null if there are no children.
	 * @param block The type of the element's block (if, then, else) or null if the block is not defined.
	 */
	constructor(couldBeChildren: boolean, indexElement: Array<number> | null = null, children?: Array<SkeletonStructure> | null, block: string | null = null) {
		this.indexElement = indexElement;
		this.couldBeChildren = couldBeChildren;
		this.block = block;
		this.childCount = 0;
		if (children) {
			this.children = children;
		} else {
			if (couldBeChildren) {
				this.children = new Array<SkeletonStructure>();
			} else {
				this.children = null;
			}
		}
	}

	/**
	 * Creates a new element and adds it to the current structure.
	 * @param couldBeChildren A marker indicating whether the new element can have children.
	 * @param positionElementFromArray The position in the array of elements to insert the new element, or null.
	 * @param block The type of the element's block (if, then, else) or null if the block is not defined.
	 * @returns The created element or null if creation failed.
	 */
	private createChildrenToParent(couldBeChildren: boolean, positionElementFromArray: number | null, block: string | null,): SkeletonStructure | undefined {
		if (this.couldBeChildren) {
			const indexArray = new Array<number>();
			if (this.indexElement === null) {
				indexArray.push(this.childCount);
				this.childCount++;
			} else {
				this.indexElement.forEach(index => {
					indexArray.push(index);
				});
				indexArray.push(this.childCount);
				this.childCount++;
			}
			const newElement = new SkeletonStructure(couldBeChildren, indexArray, couldBeChildren ? new Array<SkeletonStructure>() : null, block);
			if (this.children) {
				if (positionElementFromArray !== null) {
					this.children.splice(positionElementFromArray, 0, newElement);
				} else {
					this.children.push(newElement);
				}
			}
			return newElement;
		}
	}

	/**
	 * Adds a block to the parent element at the specified position.
	 * @param focusIndex The index of the element at the time of block addition.
	 */
	public addBlockToParent(focusIndex: string) {
		if (this.children !== null) {
			let positionElementFromArray = this.findPositionElementInTemplateStructure(focusIndex);
			const focusElement = this.children[positionElementFromArray];
			const isBlock = focusElement?.block;
			if (isBlock === TypeBlock.IF) {
				positionElementFromArray++;
			}
			this.createChildrenToParent(false, positionElementFromArray + 1, null);
			const firstElement = this.createChildrenToParent(true, positionElementFromArray + 1, null);
			if (firstElement) {
				firstElement.createChildrenToParent(false, null, TypeBlock.IF);
				firstElement.createChildrenToParent(false, null, TypeBlock.THEN);
				firstElement.createChildrenToParent(false, null, TypeBlock.ELSE);
			}
		}
	}

	/**
	 * Finds the position of an element in the array of children based on its index.
	 * @param focusIndex The index of the element to find.
	 * @returns The position of the element in the array or 0 if not found.
	 */
	public findPositionElementInTemplateStructure(focusIndex: string): number {
		if (this.children === null) {
			return -1;
		}
		return this.children.findIndex((element) => {
			if (element !== null) {
				return element.indexElement?.join(",") === focusIndex;
			}
		});

	}

	/**
	 * Finds the parent element based on the path to the element by its index.
	 * @param focusElement The path to the element as an array of indices.
	 * @returns The parent element or null if not found.
	 */
	public findParentElementByPath(focusElement: Array<number>) {
		const numberIndexElementParent = focusElement.length - 1;
		if (numberIndexElementParent === 0) {
			return this;
		}
		let parentElement: SkeletonStructure = this;
		let doneWay: Array<number> = [];
		let targetIndex: number | null = null;
		for (let i = 0; i < numberIndexElementParent; i++) {
			doneWay.push(focusElement[i]);

			targetIndex = parentElement.findPositionElementInTemplateStructure(doneWay.join(","));
			if (targetIndex === null || targetIndex === -1) {
				return;
			}
			const arrayCompsF: SkeletonStructure[] | null = parentElement.children;
			if (arrayCompsF === null) {
				return;
			}
			const targetF: SkeletonStructure = arrayCompsF[targetIndex];
			if (targetF.couldBeChildren) {
				parentElement = targetF;
			}
		}
		return parentElement;
	}

	/**
	 * Creates and returns a new structure that is a copy of the current structure.
	 * @param oldStruct The old structure to copy.
	 * @returns A new structure, a copy of the old structure.
	 */
	public static getNewStruct(oldStruct: SkeletonStructure) {
		const newChild = this.getNewChild(oldStruct);
		const newStruct = new SkeletonStructure(oldStruct.couldBeChildren, oldStruct.indexElement, newChild, oldStruct.block);
		newStruct.childCount = oldStruct.childCount;
		return newStruct;
	}

	/**
	 * Recursively creates and returns copies of the children of a structure.
	 * @param oldStruct The old structure whose children to copy.
	 * @returns An array of copies of the children of the structure.
	 */
	private static getNewChild(oldStruct: SkeletonStructure): Array<SkeletonStructure> {
		const newChildrenArray = new Array<SkeletonStructure>();
		const oldChildrenArray = oldStruct.children;
		if (oldChildrenArray) {
			oldChildrenArray.forEach(child => {
				if (child) {
					if (!child.couldBeChildren) {
						newChildrenArray.push(new SkeletonStructure(child.couldBeChildren, child.indexElement, child.children, child.block));
					} else {
						const arrayChildren = this.getNewChild(child);
						const newChild = new SkeletonStructure(child.couldBeChildren, child.indexElement, arrayChildren, child.block);
						newChild.childCount = child.childCount;
						newChildrenArray.push(newChild);
					}
				}
			});
		}
		return newChildrenArray;
	}

	/**
	 * Creates and returns a new structure that is the beginning of the hierarchy.
	 * @returns A new structure, the top element of the hierarchy.
	 */
	public static startStructure() {
		const nodeStart = new SkeletonStructure(true, null, new Array<SkeletonStructure>(), null);
		nodeStart.createChildrenToParent(false, null, null);
		return nodeStart;
	}

}

/**
 * The `TypeBlock` enumeration defines the types of block elements: IF, THEN, ELSE.
 */
enum TypeBlock {
	IF = "if",
	THEN = "then",
	ELSE = "else"
}



export function isElement(indexElement: string, struct: SkeletonStructure): boolean {
	const parent = struct.findParentElementByPath(indexElement.split(",").map(Number));
	if (!parent) {
		return false;
	}
	const position = parent.findPositionElementInTemplateStructure(indexElement);
	if (position === -1) {
		return false;
	}
	const children = parent.children;
	if (!children) {
		return false;
	}
	const element = children[position];
	if (!element) {
		return false;
	}
	return true;
}