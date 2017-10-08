'use strict';

const apiGateway = require('../fixtures/apiGateway');
const assert = require('../fixtures/assert');

describe('Create new trends', () => {

  it('can create a new trend', () => {
    let newTrend = {
      name: 'My new trend',
      type: 'Some Type',
      from: 2000,
      to: 2001,
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let trend = assert.isSuccessfulResponse(res, 201);
        assert.isValidTrend(trend);
        assert.matchesTestData(trend, newTrend);
        trend.should.not.equal(newTrend);
      });
  });

  it('should set the "Location" header to the trend\'s URL', () => {
    let newTrend = {
      name: 'Something trendy',
      type: 'test',
      from: 1800,
      to: 1900,
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let trend = assert.isSuccessfulResponse(res, 201);
        assert.isValidTrend(trend);
        res.headers.should.have.property('Location', trend.links.self);
      });
  });

  it('should return an error if the trend has an ID', () => {
    let newTrend = {
      id: 'abcdef1234567890abcdef1234567890',
      name: 'Trend with an ID',
      type: 'test',
      from: 1850,
      to: 1850,
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let body = assert.isErrorResponse(res, 400);
        body.error.should.equal('BAD_REQUEST');
        body.message.should.equal('You can\'t set "id" value when creating a trend');
      });
  });

  it('should return an error if the trend has no name', () => {
    let newTrend = {
      type: 'test',
      from: 1850,
      to: 1850,
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let body = assert.isErrorResponse(res, 400);
        body.error.should.equal('BAD_REQUEST');
        body.message.should.equal('The "name" value is missing');
      });
  });

  it('should return an error if the name is too long', () => {
    let newTrend = {
      name: 'name'.repeat(50),
      type: 'test',
      from: 1850,
      to: 1850,
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let body = assert.isErrorResponse(res, 400);
        body.error.should.equal('BAD_REQUEST');
        body.message.should.equal('The "name" value is too long (50 characters max)');
      });
  });

  it('should return an error if the trend has no type', () => {
    let newTrend = {
      name: 'Trend with no type',
      from: 1850,
      to: 1850,
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let body = assert.isErrorResponse(res, 400);
        body.error.should.equal('BAD_REQUEST');
        body.message.should.equal('The "type" value is missing');
      });
  });

  it('should return an error if the type is too long', () => {
    let newTrend = {
      name: 'Trend with loooong type',
      type: 'type'.repeat(50),
      from: 1850,
      to: 1850,
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let body = assert.isErrorResponse(res, 400);
        body.error.should.equal('BAD_REQUEST');
        body.message.should.equal('The "type" value is too long (50 characters max)');
      });
  });

  it('should return an error if the trend has no year', () => {
    let newTrend = {
      name: 'Trend with no from year',
      type: 'test type',
      to: 1850,
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let body = assert.isErrorResponse(res, 400);
        body.error.should.equal('BAD_REQUEST');
        body.message.should.equal('The "from" value is missing');
      });
  });

  it('should return an error if the trend has a non-numeric year', () => {
    let newTrend = {
      name: 'Trend with a non-numeric year',
      type: 'test type',
      from: 1850,
      to: 'hello world',
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let body = assert.isErrorResponse(res, 400);
        body.error.should.equal('BAD_REQUEST');
        body.message.should.equal('The "to" value must be a number (a 4 digit year)');
      });
  });

  it('should return an error if the year is too long ago', () => {
    let newTrend = {
      name: 'Trend with a really old year',
      type: 'test type',
      from: 123,
      to: 456,
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let body = assert.isErrorResponse(res, 400);
        body.error.should.equal('BAD_REQUEST');
        body.message.should.equal('The year 123 was too long ago. Try something newer.');
      });
  });

  it('should return an error if the year is too far in the future', () => {
    let newTrend = {
      name: 'Trend with a future year',
      type: 'test type',
      from: 1980,
      to: 2050,
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let body = assert.isErrorResponse(res, 400);
        body.error.should.equal('BAD_REQUEST');
        body.message.should.equal('The year 2050 is too far away. Stick with recent trends.');
      });
  });

  it('should return an error if the date range is reversed', () => {
    let newTrend = {
      name: 'Trend with bad date range',
      type: 'test type',
      from: 2001,
      to: 1990,
    };

    return apiGateway
      .auth('SomeUser')
      .post('/trends', newTrend)
      .then(res => {
        let body = assert.isErrorResponse(res, 400);
        body.error.should.equal('BAD_REQUEST');
        body.message.should.equal('The "from" year can\'t be greater than the "to" year');
      });
  });

});
