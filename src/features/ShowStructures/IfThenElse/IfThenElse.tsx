import React from "react";

import {SkeletonStructure} from "../../../entities/sceletonStructure";
import {EditableTextBlock} from "../../../entities/EditableTextBlock";


import styles from "./if_then_else.module.css";

interface ConditionalBlockProps {
	childElements: Array<SkeletonStructure | null> | null
	elementId: Array<number>
	updateElementText: (indexElement: string, dataText: string) => void
	indexDataMap: Map<string, string>;
	deleteBlock: (indexElement: Array<number>) => void
	focusElement: string;
	getPosition: (indexElement: string) => number;
	setPositionCursor: (indexElement: string, positionCursor: number) => void

}
/**
 * The IfThenElse component is responsible for rendering conditional blocks
 * in a message template structure. It displays child elements within the
 * condition block and supports nested condition blocks recursively.
 *
 * @param {Object} props - Props for the IfThenElse component.
 * @param {Array<SkeletonStructure | null> | null} props.childElements - An array
 *     of child elements within the conditional block.
 * @param {Array<number>} props.elementId - The ID of the current conditional block.
 * @param {(indexElement: string, dataText: string) => void} props.updateElementText -
 *     A function for setting data for an element in the structure.
 * @param {Map<string, string>} props.indexDataMap - A map associating element IDs with
 *     textual information.
 * @param {(indexElement: Array<number>) => void} props.deleteBlock - A function for
 *     deleting the current conditional block.
 * @param {string} props.focusElement - The ID of the element currently in focus.
 * @param {(indexElement: string) => number} props.getPosition - A function that returns
 *     the cursor position when given an element index.
 * @param {(indexElement: string, positionCursor: number) => void} props.setPositionCursor -
 *     A function for setting the cursor position within an element.
 *
 * @returns {JSX.Element} Returns a JSX element representing the conditional block
 *     in the message template structure.
 */
export const IfThenElse: React.FC<ConditionalBlockProps> = ({
	childElements,
	elementId,
	updateElementText,
	deleteBlock,
	indexDataMap,
	focusElement,
	getPosition,
	setPositionCursor,
}) => {
	/**
	 * Handles the click event when the delete button is clicked.
	 * Calls the deleteBlock function to delete the current conditional block.
	 */
	function onClick() {
		deleteBlock(elementId);
	}
	const childElementsArray = childElements || [];
	return (
		<div className={styles.container_if_then_else}>
			<div className={styles.container_button_line}>
				<button onClick={onClick} className={styles.button_delete}>
					✖️
				</button>
				<div className={styles.container_line}>
					<div className={styles.line}/>
				</div>
			</div>
			<div className={styles.block_if_then_else}>
				{childElementsArray.map((element, index) => {
					if (element === null) {
						return null;
					}
					if (element.couldBeChildren && element.indexElement !== null) {
						// If the element can have child elements, render nested IfThenElse component
						const struct = element.children;
						const elementKey = `${index}${element.indexElement}_if_then_else`;
						return (
							<div key={elementKey} className={styles.child_block_if_then_else}>
								< IfThenElse
									childElements={struct}
									elementId={element.indexElement}
									indexDataMap={indexDataMap}
									updateElementText={updateElementText}
									deleteBlock={deleteBlock}
									focusElement={focusElement}
									getPosition={getPosition}
									setPositionCursor={setPositionCursor}
								/>
							</div>);
					} else {
						if (!element.couldBeChildren && element.indexElement !== null) {
							let conditionLabel: string = "";
							const elementKey = `${index}${element.indexElement}_dynamic_height_input`;
							if (element.block !== null) {
								switch (element.block) {
								case "if":
									conditionLabel = "IF";
									break;
								case "then":
									conditionLabel = "THEN";
									break;
								case "else":
									conditionLabel = "ELSE";
									break;
								}
							}
							return (
								<div key={elementKey} className={styles.input_block}>
									<div className={styles.label_block}>
										{element.block ? (
											<label
												className={styles.label}
												style={{color: conditionLabel === "IF" ? "#5a8af7" : conditionLabel === "THEN" ? "#a3429b" : "#77b4e7"}}>
												{conditionLabel}
											</label>
										) : null}
									</div>
									<div className={styles.variable_input}>
										<EditableTextBlock
											indexDataMap={indexDataMap}
											updateElementText={updateElementText}
											indexElement={element.indexElement.join(",")}
											focusElement={focusElement}
											getPosition={getPosition}
											setPositionCursor={setPositionCursor}/>
									</div>
								</div>
							);
						}
					}
				})
				}
			</div>
		</div>
	);
};



