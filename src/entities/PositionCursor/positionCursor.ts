import {useState} from "react";

export interface IPositionCursor{
	indexElement: string;
	positionCursor: number;
}

export function usePositionCursor(){
	const [ positionCursor, setPositionCursor ] = useState<IPositionCursor>(new PositionCursor('0',0));

	function setPosition(indexElement: string, positionCursor: number){
		setPositionCursor(new PositionCursor(indexElement, positionCursor))
	}
	return [positionCursor, setPosition] as const;
}

class PositionCursor implements IPositionCursor{
	indexElement: string;
	positionCursor: number;
	constructor(indexArray: string, positionCursor: number) {
		this.indexElement = indexArray;
		this.positionCursor = positionCursor;
	}
}