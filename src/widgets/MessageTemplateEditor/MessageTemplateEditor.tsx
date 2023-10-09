import React, {useMemo, useState} from "react";

import {ShowStructures} from "../../features/ShowStructures";
import { addVarNameToTextWithPosition } from "../../features/addVarNameForText";
import {addElement} from "../../features/addIfThenElseBlock";
import {deleteBlock} from "../../features/deleteBlock";
import {SkeletonStructure} from "../../entities/sceletonStructure";
import {VarNameButtons} from "../../entities/VarNameButtons";
import {usePositionCursor} from "../../entities/PositionCursor";
import {useElementDataMap} from "../../entities/DataTemplate";
import {MessagePreview} from "../MessagePreview";
import {getTemplate, Template} from "../../entities/Template";

import styles from "./message_template_editor.module.css";
/**
 * Props for the MessageTemplateEditor component.
 * @interface
 * @property {Array<string>} arrVarNames - An array of variable names (required).
 * @property {Template | undefined} template - The message template (optional).
 * @property {(template: Template) => void} callbackSave - An asynchronous function to save the template.
 */
interface MessageTemplateEditorProps {
	arrVarNames: Array<string>;
	template?: Template;
	callbackSave: (template: Template) => Promise<void>;
}

export const MessageTemplateEditor: React.FC<MessageTemplateEditorProps> = (
	{
		arrVarNames,
		template,
		callbackSave
	}
) => {

	const CONTAINER_ID = "container_message_template_editor";
	// Create an array of unique variables, including variables from props (arrVarNames)
	// and variables from the template, if it exists.
	const varNamesArrayUniq = useMemo(() => {
		let combinedArray = [...arrVarNames];
		return Array.from(new Set(combinedArray));
	}, [arrVarNames, template]);
	// Create a memoized template structure.
	const templateStructure = useMemo(() => {
		let struct = SkeletonStructure.startStructure();
		if (template && template.structure) {
			struct = SkeletonStructure.getNewStruct(template.structure);
		}
		return struct;
	}, [template]);
	// Create a memoized index data map.
	const indexDataMapLoad = useMemo(() => {
		const indexDataMap = new Map<string, string>();
		if (template) {
			for (const [key, value] of template.indexDataArray) {
				indexDataMap.set(key, value);
			}
		}
		return indexDataMap;
	}, [template]);

	const [focusElement, getPosition, setPosition, deletePosition] = usePositionCursor();
	const [indexDataMap, updateElementText, setElementDataMap] = useElementDataMap(indexDataMapLoad);
	const [struct, setStruct] = useState<SkeletonStructure>(templateStructure);
	function addVarNameForData(varName: string) {

		const {updateData, newPositionCursor} = addVarNameToTextWithPosition(varName, indexDataMap, focusElement, getPosition(focusElement));
		setElementDataMap(updateData)
		setPosition(newPositionCursor.indexElement, newPositionCursor.positionCursor);
	}
	function addBlockIfThenElse() {
		const pos = {id: focusElement, pos: getPosition(focusElement)}
		const [ structNew, newMap, newPosition ] = addElement( focusElement, getPosition(focusElement), indexDataMap, struct );
		setStruct(structNew);
		setPosition(pos.id, pos.pos);
		setElementDataMap(newMap);
	}

	function deleteBlockElement(indexElement: number[]) {
		const [newIndexDataMap, newStruct, newPosition] = deleteBlock(indexElement, indexDataMap, struct);
		setElementDataMap(newIndexDataMap);
		setStruct(newStruct);
		deletePosition(indexElement, newPosition.indexElement, newPosition.positionCursor);
	}
	function saveTemplate() {
		callbackSave(getTemplate(varNamesArrayUniq, struct, indexDataMap));
	}
	function close() {
		const container = document.getElementById(CONTAINER_ID);
		if (container) {
			const child = container.firstChild;
			if (child) {
				container.removeChild(child);
			}
		}
	}

	const [isPreview, setIsPreview] = useState<boolean>(false);
	return (
		<div
			className={styles.container}>
			{!isPreview ? (
				<div>
					<label className={`${styles.title_color} ${styles.widget_title_font_size}`}>
						Message Template Editor
					</label>
					<VarNameButtons arrayVarName={varNamesArrayUniq} addVarNameForText={addVarNameForData}/>
					<div className={styles.container_title}>
						<label className={`${styles.title_color} ${styles.section_title_font_size}`}>
							Click to add
						</label>
					</div>
					<button className={styles.if_then_else_button} onClick={addBlockIfThenElse}>
						{"IF {some_variable} THEN [then_value] ELSE [else_value]"}
					</button>
					<div className={styles.container_title}>
						<label className={`${styles.title_color} ${styles.section_title_font_size}`}>
							Message template
						</label>
					</div>
					<ShowStructures
						componentsArray={struct.children}
						mapIndexData={indexDataMap}
						updateElementText={updateElementText}
						focusElement={focusElement}
						getPosition={getPosition}
						setPositionCursor={setPosition}
						deleteBlock={deleteBlockElement}/>
					<div className={styles.button_container}>
						<button
							className={`${styles.button} ${styles.function_button}`}
							onClick={() => setIsPreview(!isPreview)}>
							Preview
						</button>
						<button
							className={`${styles.button} ${styles.function_button}`}
							onClick={saveTemplate}>
							Save
						</button>
						<button
							className={`${styles.button} ${styles.close_button}`}
							onClick={close}>
							Close
						</button>
					</div>

				</div>
			) : (
				<div>
					<MessagePreview arrVarNames={varNamesArrayUniq}
									template={getTemplate(varNamesArrayUniq, struct, indexDataMap)}/>
					<button
						className={`${styles.button} ${styles.function_button} ${styles.button_edit}`}
						onClick={() => setIsPreview(!isPreview)}
					>
						EditTemplate
					</button>
				</div>
			)}
		</div>
	);
};

