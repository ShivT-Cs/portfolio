import test from "node:test";
import assert from "node:assert/strict";
import { validateInquiry } from "../lib/inquiry-validation.js";

test("valid sample payload passes validation", () => {
  const result = validateInquiry({
    name: "bsdfhshdfj",
    businessEmail: "shivkumar.j.tiwari@gmail.com",
    company: "AKSO",
    region: "India",
    service: "Cloud Migration and Business IT Onboarding",
    description: "Test",
    timeline: "5",
    website: "",
  });

  assert.equal(result.ok, true);
});

test("non-empty honeypot is rejected", () => {
  const result = validateInquiry({
    name: "Valid Name",
    businessEmail: "valid@example.com",
    company: "AKSO",
    region: "India",
    service: "Cloud Migration and Business IT Onboarding",
    description: "Valid description",
    timeline: "Q4",
    website: "https://spam.example",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.invalidFields.includes("website"), true);
  }
});

test("invalid service value is rejected", () => {
  const result = validateInquiry({
    name: "Valid Name",
    businessEmail: "valid@example.com",
    company: "AKSO",
    region: "India",
    service: "Unknown Service",
    description: "Valid description",
    timeline: "Q4",
    website: "",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.invalidFields.includes("service"), true);
  }
});
