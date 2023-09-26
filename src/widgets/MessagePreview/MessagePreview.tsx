import React, {useMemo} from "react";

import {messageGeneratorOnTemplate} from "../../features/generateTemplate";
import {ShowVariables} from "../../features/ShowVariables";


import {Template} from "../../entities/Template";
import {useElementDataMap} from "../../entities/DataTemplate";
import {EditableTextBlock} from "../../entities/EditableTextBlock";

import styles from "./message_preview.module.css";

interface MessagePreviewProps {
	arrVarNames: Array<string>;
	template: Template;
}
/**
 * MessagePreview Component
 *
 * This component is a widget designed for previewing message templates. It allows users to input variables,
 * and the displayed text dynamically updates based on the template structure and the provided variables.
 *
 * Props:
 * - arrVarNames: An array of variable names that can be used in the message template.
 * - template: An object representing the message template structure.
 */
export const MessagePreview: React.FC<MessagePreviewProps> = ({arrVarNames, template}) => {
	/**
	 * An array of objects representing variables available for use in the MessagePreview widget.
	 * Each object has the format { [variable name]: "" }.
	 * @type {[p: string]: string }[]}
	 */
	const varNamesObjectArray: {[p: string]: string}[] = generationVarNameObjectArray(arrVarNames, template);
	/**
	 * Generates an array of variable objects based on the provided variables and template.
	 * Each object has the format { [variable name]: "" }.
	 *
	 * @param {string[]} arrVarNamesFromProps - Array of variable names passed to the widget.
	 * @param {Template} template - An object representing the structure of the message template.
	 * @returns {[p: string]: string }[]} - An array of variable objects with empty values.
	 */
	function generationVarNameObjectArray(arrVarNamesFromProps: string[], template: Template): { [p: string]: string }[] {
		return template.arrVarName
			.filter(varName => arrVarNamesFromProps.includes(varName))
			.map(str => ({[str]:""}))
	}
	/**
	 * State management for variable data.
	 * - `indexDataMap`: A Map where keys are variable IDs, and values are the corresponding variable text data.
	 * - `updateElementText`: A function to update the `indexDataMap` with new variable data.
	 *   - `indexElement`: The unique identifier for the variable being updated.
	 *   - `dataText`: The updated text data for the variable.
	 */
	const [indexDataMap, updateElementText] = useElementDataMap();
	/**
	 * Dynamically generates a message based on a template and variable data.
	 * This code executes when data in the variables stored in 'indexDataMap' changes.
	 *
	 * @param {Object[]} varNamesObjectArray - An array of objects, each representing a variable and its empty value.
	 * @param {Map<string, string>} indexDataMap - A Map where keys are variable IDs, and values are the variable data.
	 * @param {Template} template - An object representing the structure of the message template.
	 * @returns {Map<string, string>} - A Map containing the generated message.
	 */
	const dataTemplate: Map<string, string> = useMemo(() => {
		varNamesObjectArray.forEach(varName => {
			const [key]= Object.keys(varName);
			if (indexDataMap.has(key)) {
				const value = indexDataMap.get(key);
				varName[key] = value || "";
			}
		});
		return getMapForTemplate(messageGeneratorOnTemplate(template, varNamesObjectArray));
	}, [varNamesObjectArray, indexDataMap, template]);
	/**
	 * Generates a Map to represent a message based on the provided text data.
	 *
	 * @param {string} data - The message content as text data.
	 * @returns {Map<string, string>} - A Map with a single key "message" and its corresponding text data.
	 */
	function getMapForTemplate(data: string): Map<string, string> {
		const mapText = new Map<string, string>();
		mapText.set("message", data);
		return mapText;
	}



	return (

		<div className={styles.preview_container}>
			<label className={`${styles.widget_title_font_size} ${styles.title_text_color}`}>
				Message Preview
			</label>
			<div className={styles.title_container}>
				<label className={`${styles.section_title_font_size} ${styles.title_text_color}`}>
					Message
				</label>
			</div>
			<EditableTextBlock className={styles.input_background} isReadonly={true} indexElement={"message"} indexDataMap={dataTemplate} />
			<div className={styles.title_container}>
				<label className={`${styles.section_title_font_size} ${styles.title_text_color}`}>
					Variables
				</label>
			</div>
			<ShowVariables arrVarNames={varNamesObjectArray} indexDataMap={indexDataMap}
						   updateElementText={updateElementText}/>
		</div>

	);
};
