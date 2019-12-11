import { mocked } from 'ts-jest/utils'
import { query } from "../db";
import { getProjects } from "./projectControllers";
import { QueryResult } from 'pg';

// info: if you want to run _just_ the tests in this file, you can call:
// $ npm run test:unit -t 'projectControllers'
jest.mock("../db");
const mockedQuery = mocked(query, true);

describe("projectControllers", () => {
  it("should handle multiple search terms", async () => {
    // arrange
    const mockedReq = { query: { searchTerm: ["test", "123"] } };
    const mockedRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    const mockedNext = () => {};

    // act
    await getProjects(mockedReq as any, mockedRes as any, mockedNext);

    // assert
    expect(mockedRes.status).toHaveBeenCalledWith(400);
    expect(mockedRes.send).toHaveBeenCalledWith({ message: "Only one search term parameter allowed" });
  });

  it("should handle invalid limit", async () => {
    // arrange
    const mockedReq = { query: { searchTerm: "test", limit: "-1" } };
    const mockedRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    const mockedNext = () => {};

    // act
    await getProjects(mockedReq as any, mockedRes as any, mockedNext);

    // assert
    expect(mockedRes.status).toHaveBeenCalledWith(400);
    expect(mockedRes.send).toHaveBeenCalledWith({ message: "Limit has to be a non-negative number" });
  });

  it("should handle valid search", async () => {
    // arrange
    const mockedProject = { projectId: 1, projectTitle: "mocked-project" };
    mockedQuery.mockResolvedValueOnce({ rows: [mockedProject] } as QueryResult<any>);
    const mockedReq = { query: { searchTerm: "test" } };
    const mockedRes = {
      send: jest.fn().mockReturnThis(),
    };
    const mockedNext = () => {};

    // act
    await getProjects(mockedReq as any, mockedRes as any, mockedNext);

    // assert
    expect(
      mockedQuery,
    ).toHaveBeenCalledWith("SELECT * from projects WHERE LOWER(project_title) LIKE $1LIMIT 20 OFFSET 0", ["%test%"]);
    expect(mockedRes.send).toHaveBeenCalledWith({ projects: [mockedProject] });
  });

  afterEach(() => mockedQuery.mockClear());
});
