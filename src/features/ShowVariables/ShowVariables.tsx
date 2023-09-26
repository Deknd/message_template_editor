import React from "react";
import {EditableTextBlock} from "../../entities/EditableTextBlock";
import styles from "./show_variables.module.css";

interface ShowVariablesProps {
	arrVarNames: { [p: string]: string }[];
	updateElementText: (indexElement: string, dataText: string) => void;
	indexDataMap: Map<string, string>;
}
/**
 * The ShowVariables component displays variables for input in a message template.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.arrVarNames - An array of variables to display.
 * @param {Function} props.updateElementText - A function to update data from the variables.
 * @param {Map} props.indexDataMap - A map where keys are variable names and values are input data.
 */
export const ShowVariables: React.FC<ShowVariablesProps> = ({arrVarNames, updateElementText, indexDataMap}) => {
	return (
		<div className={styles.variable_container}>
			{arrVarNames.map((str, index) => {
				const key = Object.keys(str)[0];
				return (
					<div key={`${key}${index}`}>
						<label className={styles.variable_label}>
							{`{${key}}`}
						</label>
						<EditableTextBlock
							indexElement={key}
							className={styles.variable_input}
							updateElementText={updateElementText}
							indexDataMap={indexDataMap}
						/>
					</div>
				);
			})}
		</div>
	);
};