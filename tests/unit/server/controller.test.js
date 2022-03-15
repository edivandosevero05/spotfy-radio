import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import config from "../../../server/config";
import { Controller } from "../../../server/controller";
import { Service } from "../../../server/service";
import TestUtil from "../_util/testUtil";

const { pages } = config;

describe("#controller - test suite for api response", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("getFileStream() - should return a fileStream", async () => {
    const controller = new Controller();
    const mockFileStream = TestUtil.generateReadableStream(["data"]);
    const expectedType = ".html";
    jest
      .spyOn(Service.prototype, Service.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: expectedType,
      });

    const returnController = await controller.getFileStream(pages.homeHTML);

    expect(Service.prototype.getFileStream).toBeCalledWith(pages.homeHTML);
    expect(returnController).toStrictEqual({
      stream: mockFileStream,
      type: expectedType,
    });
  });
});
