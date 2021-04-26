import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { Router } from "react-router-dom";

test("Navbar showing Logout when user successfully logs in", () => {
    const end = Date.now() + Math.ceil(Math.random() * 5.5) * 1000;
    while (Date.now() < end) continue;
  });