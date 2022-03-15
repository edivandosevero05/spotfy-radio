import { describe, jest, beforeEach, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import fsPromises from "fs/promises";

import { Service } from "../../../server/service";
import TestUtil from "../_util/testUtil.js";
import config from "../../../server/config";

const {
  dir: { publicDirectory },
} = config;

describe("#Service - test suite for api service", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("createFileStream() - should create a read stream and return it", async () => {
    const file = "/index.html";

    const mockFileStream = TestUtil.generateReadableStream(["anything"]);

    jest.spyOn(fs, fs.createReadStream.name).mockResolvedValue(mockFileStream);

    const service = new Service();
    const serviceReturn = service.createFileStream(file);

    expect(fs.createReadStream).toHaveBeenCalledWith(file);
    expect(serviceReturn).resolves.toStrictEqual(mockFileStream);
  });

  it("getFileInfo() - should return the file name and type when given", async () => {
    const file = "\\index.html";
    const expectedType = ".html";
    const expectedFullFilePath = publicDirectory + file;

    jest.spyOn(path, path.join.name).mockReturnValue(file);
    jest.spyOn(fsPromises, fsPromises.access.name).mockResolvedValue();
    jest.spyOn(path, path.extname.name).mockReturnValue(expectedType);

    const service = new Service();
    const serviceReturn = await service.getFileInfo(file);

    expect(fsPromises.access).toHaveBeenCalledWith(expectedFullFilePath);
    expect(serviceReturn).toStrictEqual({
      name: expectedFullFilePath,
      type: expectedType,
    });
  });

  it("getFileStream() - should return a file stream and type when given a file", async () => {
    const file = "/index.html";
    const expectedType = ".html";

    const mockFileStream = TestUtil.generateReadableStream(["anything"]);

    jest.spyOn(Service.prototype, Service.prototype.getFileInfo.name).mockReturnValue({
      stream: mockFileStream,
      type: expectedType,
    });

    jest
      .spyOn(Service.prototype, Service.prototype.createFileStream.name)
      .mockReturnValue(mockFileStream);

    const service = new Service();
    const serviceReturn = await service.getFileStream(file);

    expect(Service.prototype.getFileInfo).toHaveBeenCalledWith(file);
    expect(serviceReturn).toStrictEqual({
      stream: mockFileStream,
      type: expectedType,
    });
  });
});
