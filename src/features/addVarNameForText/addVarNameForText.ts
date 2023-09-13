import {IPositionCursor} from "../../entities/PositionCursor";

//возвращает текст со вставленной в него переменной и новую позицию курсора
export function addVarNameToTextWithPosition(
	varName: string,
	indexDataMap: Map<string, string>,
	positionCursor: IPositionCursor,
): { updateData: string, newPositionCursor: IPositionCursor } {
	const updatedData = insertVarNameIntoText(varName, indexDataMap.get(positionCursor.indexElement), positionCursor.positionCursor);
	const newPosition: IPositionCursor = {
		indexElement: positionCursor.indexElement,
		positionCursor: (positionCursor.positionCursor + varName.length)
	};
	return {updateData: updatedData, newPositionCursor: newPosition};
}

//вставляет переменную в определенную позицию курсора
function insertVarNameIntoText(varName: string, dataForTextarea: string | undefined, positionCursor: number): string {
	if (dataForTextarea) {
		if (dataForTextarea.length !== 0) {
			return dataForTextarea.slice(0, positionCursor) + varName + dataForTextarea.slice(positionCursor);
		} else {
			return varName;
		}
	} else {
		return varName;
	}
}
