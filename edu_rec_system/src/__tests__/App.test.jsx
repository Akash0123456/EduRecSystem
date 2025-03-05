import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders welcome message", () => {
  render(<App />);
  const welcomeText = screen.getByText(/Welcome/i);
  expect(welcomeText).toBeInTheDocument();
});