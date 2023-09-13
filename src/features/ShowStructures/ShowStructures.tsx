import React from "react";
import {SkeletonStructure} from "../../entities/sceletonStructure";
import {DynamicHeightInput} from "../../entities/DynamicHeightInput";
import {IfThenElse} from "./IfThenElse";

interface ShowStructuresProps {
	arrayComponents: Array<SkeletonStructure | null> | null
	mapIndexData: Map<string, string>;
	setData:  (indexElement: string, dataText: string) => void;
	positionCursor: {
		indexElement: string,
		positionCursor: number
	};
	setPositionCursor:  (indexElement: string, positionCursor: number) => void
	deleteBlock: (indexElement: Array<number>) => void;
}
//для отображения блока ввода
export const ShowStructures: React.FC<ShowStructuresProps> = ({
	arrayComponents,
	mapIndexData,
	setData,
	positionCursor,
	setPositionCursor,
	deleteBlock
}) => {
	const array = arrayComponents? arrayComponents : [];

	return (
		<div>
			{array.map((element, index: number) => {
				if(element === null){
					return null;
				}
				if (!element.couldBeChildren && element.indexElement !== null) {

					return (
						<DynamicHeightInput
							key={index}
							mapIndexData={mapIndexData}
							setData={setData}
							indexElement={element.indexElement.join(",")}
							positionCursor={positionCursor}
							setPositionCursor={setPositionCursor}/>
					);
				} else {
					if(element.couldBeChildren && element.indexElement !== null){
						return (
							< IfThenElse
								key={index}
								idElement={element.indexElement}
								struct={element.children}
								deleteBlock={deleteBlock}
								mapIndexData={mapIndexData}
								setData={setData}
								positionCursor={positionCursor}
								setPositionCursor={setPositionCursor}
							/>
						);
					}

				}
			})
			}
		</div>
	);
};