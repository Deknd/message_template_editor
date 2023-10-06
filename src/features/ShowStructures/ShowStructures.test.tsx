import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"
import { ShowStructures } from "./ShowStructures";
import {SkeletonStructure} from "../../entities/sceletonStructure";
import {addElement} from "../addIfThenElseBlock";

describe("ShowStructures Component Tests", () => {
	it("renders without errors", () => {
		render(
			<ShowStructures
				componentsArray={[]}
				mapIndexData={new Map()}
				updateElementText={() => {}}
				focusElement=""
				getPosition={() => 0}
				setPositionCursor={() => {}}
				deleteBlock={() => {}}
			/>
		);
	});

	it("renders child EditableTextBlock elements correctly", () => {
		let structure = SkeletonStructure.startStructure();
		structure = addElement("0", 0, new Map<string, string>(), structure)[0];
		// eslint-disable-next-line testing-library/no-node-access
		const childElements = structure.children;

		render(
			<ShowStructures
				componentsArray={childElements}
				mapIndexData={new Map()}
				updateElementText={() => {}}
				focusElement=""
				getPosition={() => 0}
				setPositionCursor={() => {}}
				deleteBlock={() => {}}
			/>
		);

		const deleteButtons = screen.getAllByText(/✖️/);
		expect(deleteButtons.length).toBeGreaterThan(0);

		expect(screen.getByText("IF")).toBeInTheDocument();
		expect(screen.getByText("THEN")).toBeInTheDocument();
	});

	it("renders child IfThenElse elements correctly", () => {
		let structure = SkeletonStructure.startStructure();
		structure = addElement("0", 0, new Map<string, string>(), structure)[0];
		structure = addElement("2,2",0, new Map<string, string>(),structure)[0];
		// eslint-disable-next-line testing-library/no-node-access
		const childElements = structure.children;

		render(
			<ShowStructures
				componentsArray={childElements}
				mapIndexData={new Map()}
				updateElementText={() => {}}
				focusElement=""
				getPosition={() => 0}
				setPositionCursor={() => {}}
				deleteBlock={() => {}}
			/>
		)

		const deleteButtons = screen.getAllByText(/✖️/);
		expect(deleteButtons.length).toBeGreaterThan(0);


	});
});
