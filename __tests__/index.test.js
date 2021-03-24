const { getVisitorStats } = require('../common/motorway');


const motorwayService = require('../service/motorway')

jest.useFakeTimers('modern')
jest.setSystemTime(new Date('2021-03-23'))
jest.mock('../service/motorway');


describe('count visits', () => {
  
  
  test('check if visitor has multiple visits', async () => {
    const payload = [
      {
        "id": 0,
        "name": "Visitor #0",
        "date": "2021-03-22T06:12:00+00:00"
      },{
        "id": 2,
        "name": "Visitor #1",
        "date": "2021-03-22T06:12:00+00:00"
      },{
        "id": 1,
        "name": "Visitor #2",
        "date": "2021-03-22T06:12:00+00:00"
      },{
        "id": 3,
        "name": "Visitor #1",
        "date": "2021-03-22T06:12:00+00:00"
      },
      
    ];
    
    motorwayService.getVisits.mockReturnValue(payload);

    const expectedObject = { "Visitor #0": { "weekdayVisitsCount": 1, "visits": [{ "date": "2021-03-22T06:12:00+00:00" }] }, "Visitor #1": { "weekdayVisitsCount": 2, "visits": [{ "date": "2021-03-22T06:12:00+00:00" }, { "date": "2021-03-22T06:12:00+00:00" }] }, "Visitor #2": { "weekdayVisitsCount": 1, "visits": [{ "date": "2021-03-22T06:12:00+00:00" }] } }
    const visitorStats = await getVisitorStats();

    expect(visitorStats).toEqual(expect.objectContaining(expectedObject))
  
  });

  
  test('check if weekends are skipped', async () => {
    const payload = [
      {
        "id": 0,
        "name": "Visitor #0",
        "date": "2021-03-21T06:12:00+00:00"
      },{
        "id": 1,
        "name": "Visitor #0",
        "date": "2021-03-13T06:12:00+00:00"
      }
      
    ];
    
    motorwayService.getVisits.mockReturnValue(payload);

    const expectedObject = {
      "Visitor #0":
      {
        "weekdayVisitsCount": 0,
        "visits": [
          { "date": "2021-03-21T06:12:00+00:00" },
          { "date": "2021-03-13T06:12:00+00:00" }
        ]
      }
    }
    const visitorStats = await getVisitorStats();
    expect(visitorStats).toEqual(expect.objectContaining(expectedObject))

  });


  test('check if today is skipped', async () => {
    const payload = [
      {
        "id": 0,
        "name": "Visitor #0",
        "date": "2021-03-23T06:12:00+00:00"
      }
      
    ];
    
    motorwayService.getVisits.mockReturnValue(payload);

    const expectedObject = {
      "Visitor #0":
      {
        "weekdayVisitsCount": 0,
        "visits": [
          { "date": "2021-03-23T06:12:00+00:00" },
        ]
      }
    }
    const visitorStats = await getVisitorStats();
    expect(visitorStats).toEqual(expect.objectContaining(expectedObject))

  });


});
