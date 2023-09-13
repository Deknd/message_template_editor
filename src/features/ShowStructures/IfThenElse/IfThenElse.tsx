import React, {useEffect, useState} from "react";
import {FormIfThenElse} from "./ui";
import {SkeletonStructure} from "../../../entities/sceletonStructure";

export interface IfThenElseProps {
	struct: Array<SkeletonStructure | null> | null
	idElement: Array<number>
	setData: (indexElement: string, dataText: string) => void
	mapIndexData: Map<string, string>;
	deleteBlock: (indexElement: Array<number>)=>void
	positionCursor: {
		indexElement: string,
		positionCursor: number
	},
	setPositionCursor: (indexElement: string, positionCursor: number) => void

}

export const IfThenElse: React.FC<IfThenElseProps> = ({
	struct,
	idElement,
	setData,
	deleteBlock,
	mapIndexData,
	positionCursor,
	setPositionCursor,
}) => {
	const [arrayElement, setArrayElement] = useState<Array<SkeletonStructure | null>>(struct? struct : []);
	let childrenAfterThen: SkeletonStructure | null = null;
	let childrenAfterElse: SkeletonStructure | null = null;
	if(struct){
		childrenAfterThen=struct[2];
		childrenAfterElse = struct[4];
	}

	useEffect(() => {
		if(struct !== null){
			setArrayElement(struct);
		}
	}, [struct, childrenAfterThen, childrenAfterElse]);

	return (
		<FormIfThenElse struct={arrayElement} idElement={idElement} indexDataMap={mapIndexData} setData={setData} deleteBlock={deleteBlock} positionCursor={positionCursor} setPositionCursor={setPositionCursor}/>
	);
};



