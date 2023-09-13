import {SkeletonStructure} from "../../entities/sceletonStructure";
import {getTextFromFocusElement} from "../../entities/DataTemplate";

export function deleteBlock(
	indexElement: Array<number>,
	indexDataMap: Map<string, string>,
	structComp: SkeletonStructure,

): [Map<string, string>, SkeletonStructure, {indexElement: string, positionCursor: number}] {
	const newIndexDataMap = glueText(indexElement, indexDataMap, structComp);
	const newStruct = deleteElementEditStructure(indexElement, structComp);
	const newPosition = updatingCoursePositionOnDeletionOnElement(indexElement, structComp, newIndexDataMap)
	return [newIndexDataMap, newStruct, newPosition];
}

function glueText(deletionIndexElement: Array<number>, indexDataMap: Map<string, string>, structComp: SkeletonStructure){ //: Map<string, string>
	if (deletionIndexElement.length === 1) {
		const indexPositionDeletedElement = structComp.findPositionElementInTemplateStructure(deletionIndexElement.join(","));
		const arrayChildren = structComp.children;
		if(arrayChildren === null){
			return indexDataMap;
		}
		const child = arrayChildren[indexPositionDeletedElement-1];
		if(child === null){
			return indexDataMap;
		}
		const indexChild = child.indexElement;
		if(indexChild === null){
			return indexDataMap;
		}
		const indexElementThatWillRemain = indexChild.join(",") //getIndexString(arrayChildren[indexPositionDeletedElement - 1].getIndex());
		const indexesElementsThatWillDelete = structComp.findTwoNextElements(indexPositionDeletedElement - 1);
		const sliceOneText = getTextFromFocusElement(indexElementThatWillRemain, indexDataMap);
		const sliceTwoText = getTextFromFocusElement(indexesElementsThatWillDelete.indexElementTwoString, indexDataMap);
		const newMap = createMapForGlueText(indexElementThatWillRemain, indexesElementsThatWillDelete, sliceOneText, sliceTwoText, indexDataMap);
		for (let i = 0; i < 5; i++) {
			const indexTextDelete = [...deletionIndexElement, i].join(",");
			if (newMap.has(indexTextDelete)) {
				newMap.delete(indexTextDelete);
			}
		}
		return newMap;
	} else {
		const newMap = new Map(indexDataMap);
		for (let i = 0; i < 5; i++) {
			const indexTextDelete = [...deletionIndexElement, i].join(",");
			if (newMap.has(indexTextDelete)) {
				newMap.delete(indexTextDelete);
			}
		}
		return newMap;
	}

}

function createMapForGlueText(indexRemaining: string, indexes: { indexElementOneString: string, indexElementTwoString: string }, sliceOne: string, sliceTwo: string, mapIndexData: Map<string, string>) {
	const newMap = new Map(mapIndexData);
	newMap.delete(indexes.indexElementOneString);
	newMap.delete(indexes.indexElementTwoString);
	newMap.set(indexRemaining, (sliceOne + sliceTwo));
	return newMap;
}

function deleteElementEditStructure(indexElement: Array<number>, structure: SkeletonStructure): SkeletonStructure {
	if (indexElement.length === 1) {
		return deleteInTemplateStructure(indexElement.join(","), structure);
	} else {
		return deleteInIfThenElseComp(indexElement, structure);
	}
}

function deleteInTemplateStructure(indexElement: string, structure: SkeletonStructure): SkeletonStructure {
	const indexFocusElement = structure.findPositionElementInTemplateStructure(indexElement);
	const childrenArray = structure.children;
	if(childrenArray === null){
		return structure;
	}
	const result = childrenArray.filter((_, i) => {
		return i !== indexFocusElement && i !== indexFocusElement + 1;
	});

	return new SkeletonStructure(true, null, result);
}

function deleteInIfThenElseComp(indexElement: Array<number>, structure: SkeletonStructure) {
	const indexElementChildren = indexElement[indexElement.length - 1];
	const compParent = structure.findParentElementByPath(indexElement);
	if (compParent) {
		if (indexElementChildren === 2) {
			compParent.deleteAfterThen();
		} else compParent.deleteAfterElse();
	}
	return new SkeletonStructure(true, null, structure.children);
}

function updatingCoursePositionOnDeletionOnElement(
	deletionIndexElement: Array<number>,
	oldStructComp: SkeletonStructure,
	newMapIndexData: Map<string, string>
): { indexElement: string, positionCursor: number } {
	if (deletionIndexElement.length === 1) {
		const indexPositionDeletedElement = oldStructComp.findPositionElementInTemplateStructure(deletionIndexElement.join(","));
		const arrayChildren = oldStructComp.children;
		if(arrayChildren === null){
			const text = getTextFromFocusElement([0].join(","), newMapIndexData);
			return { indexElement: '0', positionCursor: text.length}
		}
		const elementIsStaying = arrayChildren[indexPositionDeletedElement - 1];
		if(elementIsStaying === null){
			const text = getTextFromFocusElement([0].join(","), newMapIndexData);
			return { indexElement: '0', positionCursor: text.length}
		}
		const indexElement = elementIsStaying.indexElement
		if(indexElement === null){
			const text = getTextFromFocusElement([0].join(","), newMapIndexData);
			return { indexElement: '0', positionCursor: text.length}
		}
		const indexElementAsString = indexElement.join(",");
		const text = getTextFromFocusElement(indexElementAsString, newMapIndexData);
		return { indexElement: indexElementAsString, positionCursor: text.length };
	} else {
		const parentOfDeletedElement = oldStructComp.findParentElementByPath(deletionIndexElement);
		const lastIndexDeletedElement = deletionIndexElement[deletionIndexElement.length - 1];
		if (parentOfDeletedElement) {
			const focusIndex = parentOfDeletedElement.indexElement;
			if(focusIndex === null){
				const text = getTextFromFocusElement([0].join(","), newMapIndexData);
				return { indexElement: '0', positionCursor: text.length}
			}
			if (lastIndexDeletedElement === 4) {
				const focusElement = [...focusIndex, 3].join(",");
				const text = getTextFromFocusElement( focusElement, newMapIndexData );
				return { indexElement: focusElement, positionCursor: text.length }
			} else {
				const focusElement = [...focusIndex, 1].join(",");
				const text = getTextFromFocusElement( focusElement, newMapIndexData );
				return  { indexElement: focusElement, positionCursor: text.length };
			}
		} else {
			const text = getTextFromFocusElement([0].join(","), newMapIndexData);
			return { indexElement: [0].join(","), positionCursor: text.length };
		}
	}
}