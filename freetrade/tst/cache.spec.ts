// import APIGenerator, {
//   API_PROXY_ERROR_STATUS_FILTER,
//   API_PROXY_BAD_RESPONSE_ERROR_MESSAGE,
//   formatAPIMethodName,
// // } from "../../src/api/APIGenerator.js";
// import APIGenerator from "../../src/api/APIGenerator";
// import { ApiConfig } from "../../src/types";

import { getStockPrice } from "../src/index";
import { cache, Cache, TickerEntry } from "../src/cache";

describe("index test", () => {
  //   let mockBody;
  //   let mockResponse;

  beforeEach(() => {
    Math.random = jest.fn(() => 0.5);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("getStockPrice not in cache", () => {
    const spyHas = jest
      .spyOn(cache, "has")
      .mockImplementation((_key: string) => {
        return false;
      });

    const spySet = jest
      .spyOn(cache, "set")
      .mockImplementation(
        (_key: string, _value: TickerEntry | [string, TickerEntry]) => {}
      );

    expect(getStockPrice("AAPL")).toEqual(500);

    expect(spyHas).toHaveBeenCalledTimes(1);
    expect(spySet).toHaveBeenCalledTimes(1);
  });

  it("getStockPrice in cache", () => {
    const spyHas = jest
      .spyOn(cache, "has")
      .mockImplementation((_key: string) => {
        return true;
      });

    const spyGet = jest
      .spyOn(cache, "get")
      .mockImplementation((_key: string) => {
        return new TickerEntry("AAPL", 400);
      });

    expect(getStockPrice("AAPL")).toEqual(400);

    expect(spyHas).toHaveBeenCalledTimes(1);
    expect(spyGet).toHaveBeenCalledTimes(1);
  });

  it("cache eviction test", () => {
    const testCache: Cache = new Cache(2, 0.5);
    const spyEvictionPolicy = jest.spyOn(testCache, "evictionPolicy");

    testCache.set("AAPL", new TickerEntry("AAPL", 400));
    testCache.set("MSFT", new TickerEntry("MSFT", 500));
    testCache.set("TSLA", new TickerEntry("TSLA", 600));

    expect(spyEvictionPolicy).toHaveBeenCalledTimes(1);
    // expect(testCache.cache).toEqual(2);
  });

  // beforeEach(() => {
  //   // mockBody = {
  //   //   cases: [
  //   //     {
  //   //       title: "Tuesday",
  //   //     },
  //   //     {
  //   //       title: "Not-a-Tuesday",
  //   //     },
  //   //   ],
  //   // };
  //   // mockResponse = {
  //   //   body: JSON.stringify(mockBody),
  //   //   status: 200,
  //   //   statusText: "OK",
  //   //   // some extra info that should be filtered
  //   //   aborted: false,
  //   //   method: "GET",
  //   // };
  // });

  // describe("constructor", () => {
  //   it("should throw an error if apiBaseUrl is not set", () => {
  //     expect(() => new APIGenerator({} as ApiConfig)).toThrow(
  //       "APIGenerator: You need to provide the constructor an apiBaseURL property containing a string that represents the base URL of your API"
  //     );
  //   });

  //   it("should throw an error if apiMethods is not an array", () => {
  //     expect(
  //       () => new APIGenerator({ apiBaseURL: "localhost" } as ApiConfig)
  //     ).toThrow(
  //       "APIGenerator: You need to provide the constructor an apiMethods property containing at least one apiMethodConfig object"
  //     );
  //   });

  //   it("shloud throw an error if filters is not an array", () => {
  //     expect(
  //       () =>
  //         new APIGenerator({
  //           apiBaseURL: "localhost",
  //           apiMethods: [{}],
  //         } as ApiConfig)
  //     ).toThrow(
  //       "APIGenerator: You need to provide the constructor a filters property containing at least one filter function in an Array to handle how the response is returned"
  //     );
  //   });
  // });

  //   describe("formatAPIMethodName", () => {
  //     it("should capitalize the letter of a string passed to it", () => {
  //       expect(formatAPIMethodName("lowercaseString")).to.equal(
  //         "LowercaseString"
  //       );
  //     });
  //     it("should throw an error when provided invalid arguments", () => {
  //       expect(() => formatAPIMethodName("lowercaseString")).not.toThrow();
  //       expect(() => formatAPIMethodName({})).toThrow();
  //       expect(() => formatAPIMethodName([])).toThrow();
  //       expect(() => formatAPIMethodName(25)).toThrow();
  //       expect(() => formatAPIMethodName("")).toThrow();
  //       expect(() => formatAPIMethodName(undefined)).toThrow();
  //       expect(() => formatAPIMethodName(null)).toThrow();
  //     });
  //   });

  //   describe("API_PROXY_ERROR_STATUS_FILTER", () => {
  //     it("should only be applied when status code is >= 400", () => {
  //       const result = API_PROXY_ERROR_STATUS_FILTER(mockResponse);
  //       expect(result).to.deep.equal(mockResponse);
  //     });
  //     it("should throw an error if the response is undefined", () => {
  //       expect(() => API_PROXY_ERROR_STATUS_FILTER()).toThrow(
  //         API_PROXY_BAD_RESPONSE_ERROR_MESSAGE
  //       );
  //     });
  //     it("should throw an error if the response does not contain a status", () => {
  //       expect(() => API_PROXY_ERROR_STATUS_FILTER({})).toThrow(
  //         API_PROXY_BAD_RESPONSE_ERROR_MESSAGE
  //       );
  //     });
  //     it("should throw the expected error when the response status code is >= 400", () => {
  //       mockResponse.status = 500;
  //       expect(() => API_PROXY_ERROR_STATUS_FILTER(mockResponse))
  //         .toThrow(Error, `${mockResponse.status}: ${mockResponse.statusText}`)
  //         .that.includes({
  //           body: mockResponse.body,
  //           authenticated: true,
  //           status: mockResponse.status,
  //           statusText: mockResponse.statusText,
  //         });
  //     });
  //     it("should throw the expected error when the response body is not valid JSON", () => {
  //       mockResponse.status = 400;
  //       mockResponse.body = '"';
  //       expect(() => API_PROXY_ERROR_STATUS_FILTER(mockResponse))
  //         .toThrow(Error, `${mockResponse.status}: ${mockResponse.statusText}`)
  //         .that.includes({
  //           body: mockResponse.body,
  //           authenticated: true,
  //           status: mockResponse.status,
  //           statusText: mockResponse.statusText,
  //         });
  //     });
  //     it("should include the response.body (if available) in the error message when the error code is 400", () => {
  //       mockResponse.status = 400;
  //       mockResponse.body = {
  //         message: "Custom 400 error message.",
  //       };
  //       expect(() => API_PROXY_ERROR_STATUS_FILTER(mockResponse))
  //         .toThrow(Error, `${mockResponse.status}: ${mockResponse.body.message}`)
  //         .that.includes({
  //           body: mockResponse.body,
  //           authenticated: true,
  //           status: mockResponse.status,
  //           statusText: mockResponse.statusText,
  //         });

  //       mockResponse.body = {};
  //       expect(() => API_PROXY_ERROR_STATUS_FILTER(mockResponse))
  //         .toThrow(Error, `${mockResponse.status}: ${mockResponse.statusText}`)
  //         .that.includes({
  //           body: mockResponse.body,
  //           authenticated: true,
  //           status: mockResponse.status,
  //           statusText: mockResponse.statusText,
  //         });
  //     });
  //     it("should not include the response.body in the error message when the error code is not 400", () => {
  //       mockResponse.status = 500;
  //       mockResponse.body = {
  //         message: "Custom 400 error message.",
  //       };
  //       expect(() => API_PROXY_ERROR_STATUS_FILTER(mockResponse))
  //         .toThrow(Error, `${mockResponse.status}: ${mockResponse.statusText}`)
  //         .that.includes({
  //           body: mockResponse.body,
  //           authenticated: true,
  //           status: mockResponse.status,
  //           statusText: mockResponse.statusText,
  //         });
  //     });
  //   });

  //   describe("request", () => {
  //     let apiGenerator;
  //     let requestLibStub;
  //     beforeEach(() => {
  //       requestLibStub = sinon.stub().returns(Promise.resolve());
  //       apiGenerator = new APIGenerator({
  //         apiBaseURL: "localhost",
  //         apiMethods: [
  //           {
  //             name: "getTestData",
  //             method: "GET",
  //             path: "/test",
  //           },
  //           {
  //             name: "postTestData",
  //             method: "POST",
  //             path: "/test",
  //           },
  //         ],
  //         filters: [(i) => i],
  //         requestLib: requestLibStub,
  //       });
  //     });

  //     it("Send a GET request without request parameter", () => {
  //       apiGenerator.getTestData();
  //       expect(requestLibStub.calledOnce).to.equal(true);
  //       expect(requestLibStub.firstCall.args[0]).to.includes({
  //         body: null,
  //         method: "GET",
  //         url: "localhost/test",
  //       });
  //     });

  //     it("Send a GET request with request parameters", () => {
  //       apiGenerator.getTestData({ key1: "param1", key2: "param2" });
  //       expect(requestLibStub.calledOnce).to.equal(true);
  //       expect(requestLibStub.firstCall.args[0]).to.includes({
  //         body: null,
  //         method: "GET",
  //         url: "localhost/test?key1=param1&key2=param2",
  //       });
  //     });

  //     it("Send a POST request without body", () => {
  //       apiGenerator.postTestData();
  //       expect(requestLibStub.calledOnce).to.equal(true);
  //       expect(requestLibStub.firstCall.args[0]).to.includes({
  //         method: "POST",
  //         url: "localhost/test",
  //       });
  //       expect(requestLibStub.firstCall.args[0].body).to.deep.equal({});
  //     });

  //     it("Send a POST request without body", () => {
  //       const body = { key1: "param1", key2: "param2" };
  //       apiGenerator.postTestData(body);
  //       expect(requestLibStub.calledOnce).to.equal(true);
  //       expect(requestLibStub.firstCall.args[0]).to.includes({
  //         method: "POST",
  //         url: "localhost/test",
  //       });
  //       expect(requestLibStub.firstCall.args[0].body).to.equal(body);
  //     });
  //   });
});
