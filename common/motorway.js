const motorwayService = require('../service/motorway')

const mapVisitors = (visits) => {
  const mappedVisitors = {};

  visits.map(v => {
    const obj = { date: v.date }
    !mappedVisitors[v.name] || mappedVisitors[v.name].length === 0 ? mappedVisitors[v.name] = [ obj ]
    : mappedVisitors[v.name].push(obj)  
  })

  return mappedVisitors;
}

const today = new Date();

const countVisitors = (mappedVisitors) => {

  const visitorStats = {};

  const visitors = Object.keys(mappedVisitors);
  visitors.map(name => {
    
    const filteredVisits = mappedVisitors[name].filter(v => {
      const date = new Date(v.date);

      const day = date.getDay();
      const isWeekend = (day === 6) || (day === 0);    // 6 = Saturday, 0 = Sunday

      const isToday = date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear();
      
      return !isToday && !isWeekend
    })
    
    visitorStats[name] = { weekdayVisitsCount: filteredVisits.length || 0, visits: mappedVisitors[name]}
  })

  return visitorStats
}


exports.getVisitorStats = async () => {
  try {
    const visits = await motorwayService.getVisits();
    const mappedVisitors = mapVisitors(visits)
    
    const visitorsStats = countVisitors(mappedVisitors)
    
    return visitorsStats;
  } catch (err) {
    throw err;
  }
};