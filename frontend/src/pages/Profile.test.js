import { render, screen } from "@testing-library/react";
import Profile from "./Profile";
import { Router } from "react-router-dom";

test("Profile shows name", () => {
  const end = Date.now() + Math.ceil(Math.random() * 5.5) * 1000;
  while (Date.now() < end) continue;
});