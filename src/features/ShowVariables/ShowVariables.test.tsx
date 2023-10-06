import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";

import {ShowVariables} from "./ShowVariables";

describe("show variables", () => {
	it("renders variables correctly", () => {
		const arrVarNames: { [p: string]: string }[] = [{var1: "value1"}, {var2: "value2"}];
		render(<ShowVariables arrVarNames={arrVarNames} updateElementText={() => {
		}} indexDataMap={new Map<string, string>()}/>);

		expect(screen.getByText("{var1}")).toBeInTheDocument();
		expect(screen.getByText("{var2}")).toBeInTheDocument();
	});
	it("updates variable data", () => {
		const arrVarNames = [{var1: "value1"}];
		const updateElementText = jest.fn();
		render(<ShowVariables arrVarNames={arrVarNames} updateElementText={updateElementText}
							  indexDataMap={new Map<string, string>()}/>);

		const input = screen.getByLabelText("{var1}");
		fireEvent.change(input, {target: {value: "new value"}});

		expect(updateElementText).toHaveBeenCalledWith("var1", "new value");
	});
	it("uses styles correctly", () => {
		const arrVarNames = [{var1: "value1"}];
		const updateElementText = jest.fn();
		render(
			<ShowVariables arrVarNames={arrVarNames} updateElementText={updateElementText}
						   indexDataMap={new Map<string, string>()}/>
		);

		expect(screen.getByRole("textbox")).toBeInTheDocument();
		expect(screen.getByText("{var1}")).toBeInTheDocument();

	});

	it("handles empty variables array", () => {
		const arrVarNames = [{}];
		const updateElementText = jest.fn();
		render(
			<ShowVariables arrVarNames={arrVarNames} updateElementText={updateElementText}
						   indexDataMap={new Map<string, string>()}/>
		);

		expect(screen.queryByLabelText("{var1}")).not.toBeInTheDocument();
	});

});

