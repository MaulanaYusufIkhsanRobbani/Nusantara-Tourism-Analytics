export const MOCK_TOURISM_DATA = {
  monthlyArrivals: [
    { month: 'Jan', count: 450000, domestic: 300000, international: 150000 },
    { month: 'Feb', count: 480000, domestic: 310000, international: 170000 },
    { month: 'Mar', count: 520000, domestic: 330000, international: 190000 },
    { month: 'Apr', count: 590000, domestic: 350000, international: 240000 },
    { month: 'Mei', count: 650000, domestic: 390000, international: 260000 },
    { month: 'Jun', count: 720000, domestic: 420000, international: 300000 },
    { month: 'Jul', count: 810000, domestic: 460000, international: 350000 },
    { month: 'Agu', count: 850000, domestic: 480000, international: 370000 },
    { month: 'Sep', count: 780000, domestic: 450000, international: 330000 },
    { month: 'Okt', count: 710000, domestic: 430000, international: 280000 },
    { month: 'Nov', count: 680000, domestic: 410000, international: 270000 },
    { month: 'Des', count: 950000, domestic: 550000, international: 400000 },
  ],
  topDestinations: [
    { name: 'Bali', visitors: 4200000, growth: 15.2 },
    { name: 'Jakarta', visitors: 2800000, growth: 5.4 },
    { name: 'Yogyakarta', visitors: 1900000, growth: 12.1 },
    { name: 'Lombok', visitors: 1200000, growth: 22.5 },
    { name: 'Labuan Bajo', visitors: 850000, growth: 35.8 },
  ],
  sentiment: {
    positive: 78,
    neutral: 15,
    negative: 7,
  },
  keyMetrics: {
    totalArrivals: 12500000,
    yoyGrowth: 14.3,
    avgSpendPerTourist: 1250, // USD
    avgStayLength: 7.2, // Days
  }
};
