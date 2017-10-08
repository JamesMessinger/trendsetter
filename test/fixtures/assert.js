'use strict';

const chai = require('chai');
const expect = chai.expect;
chai.should();

let assert = module.exports = {
  /**
   * Asserts that the given trend is valid.
   *
   * @param {object} trend - The trend to validate
   * @returns {object} - Returns the trend
   */
  isValidTrend (trend) {
    try {
      expect(trend).to.be.an('object');
      trend.should.have.keys('id', 'type', 'name', 'from', 'to');

      expect(trend.id).to.be.a('string').and.match(/^[a-f0-9]{32}^/);
      expect(trend.type).to.be.a('string').and.not.empty;
      expect(trend.name).to.be.a('string').and.not.empty;
      expect(trend.to).to.be.a('number').above(1600).and.below(3000);
      expect(trend.from).to.be.a('number').above(1600).and.below(3000);
      trend.from.should.be.atMost(trend.to);

      return trend;
    }
    catch (error) {
      console.error(`\nTrend: \n${JSON.stringify(trend, null, 2)}\n`);
      throw error;
    }
  },

  /**
   * Asserts that the given response is well formed.
   *
   * @param {object} response - The HTTP response to validate
   * @param {number} statusCode - The expected status code
   * @returns {object} - Returns the parsed response body
   */
  isValidResponse (response, statusCode) {
    try {
      expect(response).to.be.an('object');
      response.should.have.keys('statusCode', 'headers', 'body');

      expect(response.statusCode).to.be.a('number');
      response.statusCode.should.equal(statusCode);
      response.statusCode.should.be.at.least(100).and.below(600);

      expect(response.headers).to.be.an('object');
      for (let key of Object.keys(response.headers)) {
        expect(key).to.be.a('string').and.match(/^[a-z]+(\-[a-z]+)*$/i);
        expect(response.headers[key]).to.be.a('string');
      }

      expect(response.body).to.be.a('string').and.not.empty;
      return JSON.parse(response.body);
    }
    catch (error) {
      console.error(`\nHTTP response: \n${JSON.stringify(response, null, 2)}\n`);
      throw error;
    }
  },

  /**
   * Asserts that the given response is well formed and is not an error.
   *
   * @param {object} response - The HTTP response to validate
   * @param {number} statusCode - The expected status code
   * @returns {object} - Returns the parsed response body
   */
  isSuccessfulResponse (response, statusCode) {
    let body = assert.isValidResponse(response, statusCode);
    response.statusCode.should.be.at.least(200).and.below(300);
    return body;
  },

  /**
   * Asserts that the given response is well formed and is an error.
   *
   * @param {object} response - The HTTP response to validate
   * @param {number} statusCode - The expected status code
   * @returns {object} - Returns the parsed response body
   */
  isErrorResponse (response, statusCode) {
    let body = assert.isValidResponse(response, statusCode);
    response.statusCode.should.be.at.least(400).and.below(600);

    body.should.be.an('object');
    body.should.have.keys('error', 'message');
    body.error.should.be.a('string').and.match(/^[A-Z]+(_[A-Z]+)*$/);
    body.message.should.be.a('string').and.not.empty;

    return body;
  },
};
