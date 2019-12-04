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
  it("Returns all projects for empty search term", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=");
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBeGreaterThan(0);
  });
  it("Returns searched projects - single-word searchTerm", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=plan");
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBe(2);
  });
  it("Returns searched projects - search is case-insensitive", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan");
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBe(2);
  });
  it("Returns searched projects - only one searchTerm is valid in the query string", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&searchTerm=Plan");
    expect(res.body.projects).toBeFalsy();
    expect(res.status).toBe(400);
  });
  it("Returns searched projects - multi word search", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=trip%20graduation%20plan");
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBe(1);
  });
  it("Returns searched projects - limit 1 offset 1 returns 1 result", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&limit=1&offset=1");
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBe(1);
  });
  it("Returns searched projects - limit -1 offset 1 returns bad request result", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&limit=-1&offset=1");
    expect(res.body.projects).toBeFalsy();
    expect(res.status).toBe(400);
  });
  it("Returns searched projects - limit 1 offset -1 returns bad request result", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&limit=1&offset=-1");
    expect(res.body.projects).toBeFalsy();
    expect(res.status).toBe(400);
  });
  it("Returns searched projects - limit a offset 1 returns bad request result", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&limit=a&offset=1");
    expect(res.body.projects).toBeFalsy();
    expect(res.status).toBe(400);
  });
  it("Returns searched projects - limit 1 offset a returns bad request result", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&limit=1&offset=a");
    expect(res.body.projects).toBeFalsy();
    expect(res.status).toBe(400);
  });
});
