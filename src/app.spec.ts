import request from "supertest";
import { getApp } from "./app";

describe("/api/test", () => {
  it("works", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/test");
    const { ok } = res.body;
    expect(res.status).toEqual(200);
    expect(ok).toEqual(true);
  });
});

describe("/api/projects", () => {
  it("Returns some example projects", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects");
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBeGreaterThan(0);
  });
  it("Returns searched projects", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=plan");
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBe(2);
  });
  it("Returns searched projects", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan");
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBe(2);
  });
  it("Returns searched projects", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&searchTerm=Plan");
    expect(res.body.projects).toBeFalsy();
    expect(res.status).toBe(400);
  });
  
});
