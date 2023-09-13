import React, {useEffect, useState} from "react";

import {ShowStructures} from "../../features/ShowStructures";
import {addVarName} from "../../features/addVarNameForText";
import {addElement} from "../../features/addIfThenElseBlock";
import { deleteBlock } from "../../features/deleteBlock";
import { generateTemplate } from "../../features/generateTemplate";

import {SkeletonStructure, Template} from "../../entities/sceletonStructure";
import {VarNameButtons} from "../../entities/VarNameButtons";
import {usePositionCursor} from "../../entities/PositionCursor";
import {useDataTemplate} from "../../entities/DataTemplate";

interface MessageTemplateEditorProps {
	arrVarNames: () => Array<string>;
	template: () => Template
	callbackSave: () => void;
}


export const MessageTemplateEditor: React.FC<MessageTemplateEditorProps> = (
	{
		arrVarNames,
		template,
		callbackSave
	}
) => {
	let arrayVarNames: Array<string> = [];
	useEffect(()=>{
		arrayVarNames = arrVarNames()
		console.log("загруженый из памяти",template())

	},[])

	const [positionCursor, setPosition] = usePositionCursor();
	const [indexDataMap, updateIndexDataMap, setIndexDataMap] = useDataTemplate();
	const [ struct, setStruct ] = useState<SkeletonStructure>(new SkeletonStructure(true, null,[new SkeletonStructure(false,[0])]))

	//добавляет переменную в шаблон, обновляет положение курсора
	function addVarNameForData(varName: string) {
		const {updateData, newPositionCursor} = addVarName(varName, indexDataMap, positionCursor);
		updateIndexDataMap(newPositionCursor.indexElement, updateData);
		setPosition(newPositionCursor.indexElement, newPositionCursor.positionCursor);
	}

	function onClick(){
		const structNew = addElement(positionCursor, indexDataMap, struct);
		setStruct(structNew[0])
		const newPos = structNew[2];
		setPosition(newPos.indexElement,newPos.positionCursor)
		setIndexDataMap(structNew[1])
	}
	function deleteBlockElement(indexElement: number[]){
		const newData = deleteBlock(indexElement, indexDataMap, struct)
		setIndexDataMap(newData[0]);
		setStruct(newData[1]);
		const newPos = newData[2];
		setPosition(newPos.indexElement, newPos.positionCursor)
	}
	function saveTemplate(){
		let template: Template;

		const arrayMap =new Array<Array<string>>()
		indexDataMap.forEach((value, key)=>{
			arrayMap.push([value, key]);
		})
		template = {
			arrVarName: arrayVarNames,
			structure: struct,
			indexDataMap: arrayMap,
		}
		const templateJSON = JSON.stringify(template);
		console.log(templateJSON);
		const returnStruct: Template = JSON.parse(templateJSON);
		console.log("old obj: ",template, " parse Obj: ",returnStruct)
		localStorage.setItem('template', templateJSON);
		//generateTemplate(struct, indexDataMap, arrVarNames);
	}


	return (
		<div
			style={{
				height: "100%",
				backgroundColor: "blue",
				paddingTop: "1em",
				paddingLeft: "1em",
				paddingRight: "1em",
				borderColor: "red",
				borderWidth: "2px",
				borderStyle: "solid"
			}}>
			{`Position id: ${positionCursor.indexElement}, positionCursor: ${positionCursor.positionCursor}`}
			<VarNameButtons arrayVarName={arrayVarNames} addVarNameForText={addVarNameForData}/>
			<button onClick={onClick} >
				{"Click to add: IF {some_variable} THEN [then_value] ELSE [else_value]"}
			</button>
			<ShowStructures
				arrayComponents={struct.children}
				mapIndexData={indexDataMap}
				setData={updateIndexDataMap}
				positionCursor={positionCursor}
				setPositionCursor={setPosition}
				deleteBlock={deleteBlockElement}/>
			<div style={{
				display: "flex",
				justifyContent: "center",
				gap: "10em",
			}}>
				<span>
					<button>Preview</button>
				</span>
				<span>
					<button onClick={saveTemplate}>Save</button>
				</span>
				<span>
					<button>Close</button>
				</span>
			</div>
		</div>
	);
};

