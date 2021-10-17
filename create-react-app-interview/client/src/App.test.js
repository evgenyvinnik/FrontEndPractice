import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import ReactTestRenderer from "react-test-renderer";
import * as ReactTestingLibrary from "@testing-library/react";
import * as Enzyme from "enzyme";
import App from "./App";

describe("App", () => {
  it("renders with `react-dom`", () => {
    const domContainer = document.createElement("div");
    expect(() => ReactDOM.render(<App />, domContainer)).not.toThrow();
  });

  it("renders with `react-dom/test-utils`", () => {
    const component = ReactTestUtils.renderIntoDocument(<App />);
    const heading = ReactTestUtils.findRenderedDOMComponentWithTag(
      component,
      "H1"
    );
    expect(heading.textContent).toBe("Hello World");
  });

  it("renders with `react-test-renderer`", () => {
    const component = ReactTestRenderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with `@testing-library/react", () => {
    const { getByText } = ReactTestingLibrary.render(<App />);
    const heading = getByText("Hello World");
    expect(heading.tagName).toBe("H1");
  });

  it("renders with `enzyme`", () => {
    const tree = Enzyme.shallow(<App />);
    expect(tree).toMatchSnapshot();
  });
});
