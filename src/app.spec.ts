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

let token = 'empty';

async function auth() {
  const app = await getApp();
  const response = await request(app)
    .post("/api/login")
    .send({
      email: 'deepBeutifulSea@gmail.com',
      password: '!.Ba1234:!'
    });
  // TODO: take token from response - low prio
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJ1c2VyTmFtZSI6IlJlZzEiLCJ1c2VyRW1haWwiOiJyZWcxQHJlZy5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQ2bjhOOUs4cHBxT3JqZFhsalNJcU8uVThoNmxuTDY5Ry80QzFXZi41U3RIMVNTd2xHTkU0VyIsInVzZXJJbWFnZVVybCI6bnVsbCwiam9pbkRhdGUiOiIyMDE5LTEyLTA0VDE0OjUxOjIwLjEwM1oiLCJsZWF2ZURhdGUiOm51bGwsImlhdCI6MTU3NTQ3NDkxOX0.nrHFu4PhmpNTShq909qNj8geVBACB5XWDhT2OSgkxlY";
}

beforeEach(() => {
  auth();
});

describe("/api/projects", () => {
  it("Returns some example projects", async () => {
    const app = await getApp();
    const res = await request(app)
      .get("/api/projects")
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBeGreaterThan(0);
  });

  it("Returns all projects for empty search term", async () => {
    const app = await getApp();
    const res = await request(app)
      .get("/api/projects?searchTerm=")
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBeGreaterThan(0);
  });
  it("Returns searched projects - single-word searchTerm", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=plan")
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBe(2);
  });
  it("Returns searched projects - search is case-insensitive", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan")
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBe(2);
  });
  it("Returns searched projects - only one searchTerm is valid in the query string", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&searchTerm=Plan")
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.projects).toBeFalsy();
    expect(res.status).toBe(400);
  });
  it("Returns searched projects - multi word search", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=trip%20graduation%20plan")
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBe(1);
  });
  it("Returns searched projects - limit 1 offset 1 returns 1 result", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&limit=1&offset=1")
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBe(1);
  });
  it("Returns searched projects - limit -1 offset 1 returns bad request result", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&limit=-1&offset=1")
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.projects).toBeFalsy();
    expect(res.status).toBe(400);
  });
  it("Returns searched projects - limit 1 offset -1 returns bad request result", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&limit=1&offset=-1")
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.projects).toBeFalsy();
    expect(res.status).toBe(400);
  });
  it("Returns searched projects - limit a offset 1 returns bad request result", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&limit=a&offset=1")
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.projects).toBeFalsy();
    expect(res.status).toBe(400);
  });
  it("Returns searched projects - limit 1 offset a returns bad request result", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/projects?searchTerm=Plan&limit=1&offset=a")
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.projects).toBeFalsy();
    expect(res.status).toBe(400);
  });

});
