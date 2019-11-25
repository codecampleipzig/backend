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
    console.log(res.body);
    expect(res.body.projects.length).toBeGreaterThan(0);
  });
});
