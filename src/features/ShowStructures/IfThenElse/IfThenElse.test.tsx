import React from "react";
import {render, fireEvent, getByText, screen} from "@testing-library/react";
import "@testing-library/jest-dom"
import { IfThenElse } from "./IfThenElse";
import {SkeletonStructure} from "../../../entities/sceletonStructure";
import {addElement} from "../../addIfThenElseBlock";

describe("IfThenElse Component Rendering Tests", () => {
	it("renders without errors", () => {
		render(
			<IfThenElse
				childElements={[]}
				elementId={[1]}
				updateElementText={() => {}}
				deleteBlock={() => {}}
				indexDataMap={new Map()}
				focusElement=""
				getPosition={() => 0}
				setPositionCursor={() => {}}
			/>
		);
	});

	it("renders child elements correctly", () => {
		let structure = SkeletonStructure.startStructure();
		structure = addElement("0", 0, new Map<string, string>(), structure)[0];
		// eslint-disable-next-line testing-library/no-node-access
		const childElements = structure.children;

		render(
			<IfThenElse
				childElements={childElements}
				elementId={[1]}
				updateElementText={() => {}}
				deleteBlock={() => {}}
				indexDataMap={new Map()}
				focusElement=""
				getPosition={() => 0}
				setPositionCursor={() => {}}
			/>
		);
		const deleteButtons = screen.getAllByText(/✖️/);
		expect(deleteButtons.length).toBeGreaterThan(0);

		expect(screen.getByText("IF")).toBeInTheDocument();
		expect(screen.getByText("THEN")).toBeInTheDocument();
	});

	it("reacts to delete button click", () => {
		const deleteBlockMock = jest.fn();

		render(
			<IfThenElse
				childElements={[]}
				elementId={[1]}
				updateElementText={() => {}}
				deleteBlock={deleteBlockMock}
				indexDataMap={new Map()}
				focusElement=""
				getPosition={() => 0}
				setPositionCursor={() => {}}
			/>
		);

		const deleteButton = screen.getByText("✖️");
		fireEvent.click(deleteButton);

		expect(deleteBlockMock).toHaveBeenCalledWith([1]);
	});
});
