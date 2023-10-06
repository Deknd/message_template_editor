import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {VarNameButtons} from "./index";

describe("VarNameButtons component", () => {
	it("renders variable buttons correctly", () => {
		const arrayVarName = ["var1", "var2", "var3"];
		const addVarNameForText = jest.fn();

		render(<VarNameButtons arrayVarName={arrayVarName} addVarNameForText={addVarNameForText}/>);


		arrayVarName.forEach((varName) => {
			const button = screen.getByText(`{${varName}}`);
			expect(button).toBeInTheDocument();
		});
	});

	it("calls addVarNameForText when a button is clicked", () => {
		const arrayVarName = ["var1", "var2", "var3"];
		const addVarNameForText = jest.fn();

		render(<VarNameButtons arrayVarName={arrayVarName} addVarNameForText={addVarNameForText}/>);

		const button = screen.getByText(`{${arrayVarName[0]}}`);
		fireEvent.click(button);

		expect(addVarNameForText).toHaveBeenCalledWith(`{${arrayVarName[0]}}`);
	});

	it("displays the 'Variables' section title", () => {
		const arrayVarName = ["var1", "var2", "var3"];
		const addVarNameForText = jest.fn();

		render(<VarNameButtons arrayVarName={arrayVarName} addVarNameForText={addVarNameForText}/>);

		const sectionTitle = screen.getByText("Variables");
		expect(sectionTitle).toBeInTheDocument();
	});
	it("renders correctly with empty arrayVarName", () => {
		const arrayVarName: string[] = [];
		const addVarNameForText = jest.fn();

		render(<VarNameButtons arrayVarName={arrayVarName} addVarNameForText={addVarNameForText}/>);

		const buttons = screen.queryAllByRole("button");
		expect(buttons).toHaveLength(0);
	});
	it("displays the correct number of buttons", () => {
		const arrayVarName = ["var1", "var2", "var3"];
		const addVarNameForText = jest.fn();

		render(<VarNameButtons arrayVarName={arrayVarName} addVarNameForText={addVarNameForText}/>);

		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(arrayVarName.length);
	});
	it("applies styles to elements", () => {
		const arrayVarName = ["var1", "var2", "var3"];
		const addVarNameForText = jest.fn();

		render(<VarNameButtons arrayVarName={arrayVarName} addVarNameForText={addVarNameForText}/>);

		const sectionTitle = screen.getByText("Variables");
		expect(sectionTitle).toHaveClass("title_color");
		expect(sectionTitle).toHaveClass("section_title_font_size");

		const buttons = screen.getAllByRole("button");
		buttons.forEach((button) => {
			expect(button).toHaveClass("variables");
		});
	});

});
