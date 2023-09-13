import React from "react";
import {SkeletonStructure} from "../../../../entities/sceletonStructure";
import {IfThenElse} from "../IfThenElse";
import {DynamicHeightInput} from "../../../../entities/DynamicHeightInput";


interface FormTwoElements {
	struct: Array<SkeletonStructure | null>;
	idElement: Array<number>;
	indexDataMap: Map<string, string>;
	setData: (indexElement: string, dataText: string) => void;
	deleteBlock: (indexElement: number[]) => void;
	positionCursor: {
		indexElement: string,
		positionCursor: number
	};
	setPositionCursor: (indexElement: string, positionCursor: number) => void;
}


export const FormIfThenElse: React.FC<FormTwoElements> = ({
	struct,
	idElement,
	indexDataMap,
	setData,
	deleteBlock,
	positionCursor,
	setPositionCursor
}) => {
	function onClick() {
		deleteBlock(idElement);
	}

	return (
		<div>
			{struct.map((element, index) => {
				if (element === null) {
					return null;
				}
				if (element.couldBeChildren && element.indexElement !== null) {
					const struct = element.children;
					return (
						<div
							key={index}
							style={{
								margin: "0.4em",
								display: "flex",
								justifyContent: "space-between"
							}}>
							<div style={{width: "15%"}}>
							</div>
							<div style={{
								width: "85%"
							}}>
								< IfThenElse
									struct={struct}
									idElement={element.indexElement}
									mapIndexData={indexDataMap}
									setData={setData}
									deleteBlock={deleteBlock}
									positionCursor={positionCursor}
									setPositionCursor={setPositionCursor}
								/>
							</div>
						</div>);
				} else {
					if (!element.couldBeChildren && element.indexElement !== null) {
						let text: string = "";
						switch (index) {
						case 0:
							text = "IF";
							break;
						case 1:
							text = "THEN";
							break;
						case 3:
							text = "ELSE";
							break;
						}
						return (
							<div
								key={index}
								style={{
									margin: "0.4em",
									display: "flex",
									justifyContent: "space-between"
								}}>
								<div style={{}}>
									<label style={{
										borderRadius: "0.3em",
										paddingLeft: "0.3em",
										paddingRight: "0.3em",
										paddingTop: "0.1em",
										paddingBottom: "0.1em",
										backgroundColor: "green"
									}}
										   htmlFor="">
										{text}
									</label>
									{
										(text === "IF") ?
											<button
												onClick={onClick}
												style={{
													borderRadius: "0.5em",
													marginLeft: "2em"
												}}>Delete</button>
											: null
									}
								</div>
								<div style={{
									width: "85%"
								}}>
									<DynamicHeightInput
										mapIndexData={indexDataMap}
										setData={setData}
										indexElement={element.indexElement.join(",")}
										positionCursor={positionCursor}
										setPositionCursor={setPositionCursor}/>
								</div>
							</div>);
					}
				}


			})
			}
		</div>
	);
};