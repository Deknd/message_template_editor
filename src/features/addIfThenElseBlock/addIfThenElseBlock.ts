import {SkeletonStructure} from "../../entities/sceletonStructure";
import {getTextFromFocusElement} from "../../entities/DataTemplate";


export function addElement(
	positionCursor: {
		indexElement: string;
		positionCursor: number;
	},
	mapIndexData: Map<string, string>,
	structComp: SkeletonStructure,
): [newStruct: SkeletonStructure, newMap: Map<string, string>, newPosition: { indexElement: string, positionCursor: number }] {
	const newStruct = addElementEditStructure(positionCursor.indexElement, structComp);
	const newMap = splitText(positionCursor, mapIndexData, newStruct);
	const newPosition = updatePositionWhenAddElement(positionCursor.indexElement, newStruct);

	return [newStruct, newMap, newPosition];

}

function addElementEditStructure(focusIndex: string, structure: SkeletonStructure): SkeletonStructure {
	const arrayIndex = stringToArray(focusIndex);
	if (arrayIndex.length === 1) {
		return addElementInTemplateStructure(structure, focusIndex);
	} else {
		return addElementInIfThenElseComp(structure, structure.children, focusIndex);
	}
}

function addElementInTemplateStructure(structure: SkeletonStructure, focusIndex: string): SkeletonStructure {
	const arrayChildren = structure.children;
	if (arrayChildren !== null) {
		const newArray = Array.from(arrayChildren);
		const indexElement = newArray.length;
		const nextElementInFocus = new SkeletonStructure(true, [indexElement], [
			new SkeletonStructure(false, [...[indexElement], 0]),
			new SkeletonStructure(false, [...[indexElement], 1]),
			null,
			new SkeletonStructure(false, [...[indexElement], 3]),
			null
		]);
		newArray.splice(structure.findPositionElementInTemplateStructure(focusIndex) + 1, 0, nextElementInFocus, new SkeletonStructure(false, [indexElement + 1]));
		return new SkeletonStructure(true, null, newArray);
	} else return new SkeletonStructure(true, null, arrayChildren);

}



function addElementInIfThenElseComp(struct: SkeletonStructure, arrayChildren: Array<SkeletonStructure | null> | null, focusIndex: string) {

	if (arrayChildren !== null) {
		const wayToTheElement = stringToArray(focusIndex);
		const indexElementChildren = wayToTheElement[wayToTheElement.length - 1];
		const compParent = struct.findParentElementByPath( wayToTheElement );
		if (compParent !== null && compParent) {
			if (indexElementChildren <= 1) {
				compParent.addAfterThen();
			} else {
				compParent.addAfterElse();
			}
		}
		return new SkeletonStructure(true, null, arrayChildren);
	} else return new SkeletonStructure(true);

}

// function findParentElementByPath(struct: SkeletonStructure, focusElement: Array<number>) {
//
// 	const numberIndexElementParent = focusElement.length - 2;
// 	let parentElement: SkeletonStructure | null = struct;
// 	let doneWay: Array<number> = [];
// 	let targetIndex: number | null = null;
// 	for (let i = 0; i <= numberIndexElementParent; i++) {
// 		doneWay = [...doneWay, focusElement[i]];
// 		if (parentElement === null) {
// 			return;
// 		}
// 		targetIndex = parentElement.findPositionElementInTemplateStructure(doneWay.join(","));
// 		if (targetIndex === null) {
// 			return;
// 		}
// 		const arrayCompsF: (SkeletonStructure | null)[] | null = parentElement.children;
// 		if (arrayCompsF === null) {
// 			return;
// 		}
// 		const targetF: SkeletonStructure | null = arrayCompsF[targetIndex];
// 		if (targetF === null) {
// 			return;
// 		}
// 		if (targetF.couldBeChildren) {
// 			parentElement = targetF;
// 		}
// 	}
// 	return parentElement;
// }


function stringToArray(str: string): Array<number> {
	const numberStrings: Array<string> = str.split(",");
	return numberStrings.map((numberString) => parseInt(numberString, 10));
}


function splitText(
	positionCursor: {
		indexElement: string;
		positionCursor: number;
	},
	mapIndexData: Map<string, string>,
	structComp: SkeletonStructure
) {
	const arrayIndexes = stringToArray(positionCursor.indexElement);
	if (arrayIndexes.length === 1) {
		const focusText = getTextFromFocusElement(positionCursor.indexElement, mapIndexData);
		let sliceOne = focusText.slice(0, positionCursor.positionCursor);
		let sliceTwo = focusText.slice(positionCursor.positionCursor);
		const arrayChildren = structComp.children;
		if (structComp !== null && arrayChildren !== null) {
			const indexes = structComp.findTwoNextElements(structComp.findPositionElementInTemplateStructure(positionCursor.indexElement));
			return createMapForSplitText(positionCursor.indexElement, indexes, sliceOne, sliceTwo, mapIndexData);
		}
	}
	return mapIndexData;
}

// function findTwoNextElements(positionElementInArray: number, struct: Array<SkeletonStructure | null>): { indexElementOneString: string, indexElementTwoString: string } {
// 	const elementOne = struct[positionElementInArray + 1];
// 	const elementTwo = struct[positionElementInArray + 2];
// 	if (elementOne !== null && elementTwo !== null) {
// 		const indexElementOneString = getIndexString(elementOne.indexElement);
// 		const indexElementTwoString = getIndexString(elementTwo.indexElement);
// 		console.log(indexElementTwoString);
// 		return {indexElementOneString, indexElementTwoString};
// 	} else return {indexElementOneString: "", indexElementTwoString: ""};
//
// }

// function getIndexString(indexElement: string | Array<number> | null) {
// 	if (indexElement !== null) {
// 		if (typeof indexElement === "string") {
// 			return indexElement;
// 		} else {
// 			return indexElement.join(",");
// 		}
// 	}
// 	return "";
// }



function createMapForSplitText(
	focusIndex: string,
	indexes: { indexElementOneString: string, indexElementTwoString: string },
	sliceOne: string,
	sliceTwo: string,
	mapIndexData: Map<string, string>) {
	const newMap = new Map(mapIndexData);
	newMap.set(focusIndex, sliceOne);
	newMap.set(indexes.indexElementTwoString, sliceTwo);
	return newMap;
}


function updatePositionWhenAddElement(focusIndex: string, newStructure: SkeletonStructure): {
	indexElement: string;
	positionCursor: number;
} {
	const arrayIndex = stringToArray(focusIndex);
	if (arrayIndex.length === 1) {
		const structArray = newStructure.children;
		if (structArray === null) {
			return {
				indexElement: [arrayIndex[0] + 1, 0].join(","),
				positionCursor: 0
			};
		}
		const focusPositionArray = newStructure.findPositionElementInTemplateStructure(focusIndex);
		const nextFocusElement = structArray[focusPositionArray + 1];
		if (nextFocusElement === null) {
			return {
				indexElement: [arrayIndex[0] + 1, 0].join(","),
				positionCursor: 0
			};
		}
		const nextFocusIndexElement = nextFocusElement.indexElement;
		if (nextFocusIndexElement === null) {
			return {
				indexElement: [arrayIndex[0] + 1, 0].join(","),
				positionCursor: 0
			};
		}
		return {
			indexElement: [...nextFocusIndexElement, 0].join(","),
			positionCursor: 0
		};

	} else {
		const indexElementChildren = arrayIndex[arrayIndex.length - 1];
		if (indexElementChildren === 0 || indexElementChildren === 1) {
			arrayIndex[arrayIndex.length - 1] = 2;
		} else {
			arrayIndex[arrayIndex.length - 1] = 4;
		}
		arrayIndex.push(0);
		return {
			indexElement: arrayIndex.join(","),
			positionCursor: 0
		};
	}
}
