import request from "supertest";
import { getApp } from "./app";

xdescribe("/api/projects", () => {
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

describe("/api/project", () => {
  it("should create a new project", async () => {
    const app = await getApp();
    const res = await request(app)
      .post("/api/project")
      .send({
        projectId: 2,
        projectTitle: "Project B",
        projectImageURL: "./../assets/project-default.png",
        projectDescription:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        projectGoal: "Save the world",
        projectStatus: "open",
        projectCreator: 5,
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("post");
  });
});

describe("/api/project/:projectId/task", () => {
  it("should create a new task", async () => {
    const app = await getApp();
    const res = await request(app)
      .post("/api/project/:projectId/task")
      .send({
        taskId: 1,
        projectId: 1,
        taskTitle: "Our first task",
        taskDescription:
          "Recruit some team members. And here some more, to fill up your page: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        taskStatus: "open",
        taskCreator: 3,
        menuSection: "starter"
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("post");
  });
});

describe("/api/myprojects/:userId", () => {
  it("should return an Array of users Projects", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/myprojects/:userId");
    expect(res.body.projects).toBeTruthy();
    expect(res.body.projects.length).toBeGreaterThan(0);
  })
})
