import React, { useState } from 'react';
import YearlyRevenueChart from '../components/YearlyRevenueChart';
import MonthlyRevenueChart from '../components/MonthlyRevenueChart';
import QuarterlyRevenueChart from '../components/QuarterlyRevenueChart';
import DailyRevenueRangeChart from '../components/DailyChart';
import YearlyPercentageOfSalesChart from '../components/YearlyPercentageOfSalesChart';
import MonthlyPercentageOfSalesChart from '../components/MonthlyPercentageOfSalesChart';
import QuarterlyPercentageOfSalesChart from '../components/QuarterlyPercentageOfSalesChart';
import ProductBestSaleTable from '../components/ProductBestSaleTable';
import ProductBestSaleChart from '../components/ProductBestSaleChart';
import DateRangePercentageOfSalesChart from '../components/DateRangePercentageOfSalesChart';
import ProductBestSaleByYearTable from '../components/ProductBestSaleByYearTable';
import ProductBestSaleByMonthTable from '../components/ProductBestSaleByMonthTable';
import ProductBestSaleByQuarterTable from '../components/ProductBestSaleByQuarterTable';
import ProductBestSaleByDateRangeTable from '../components/ProductBestSaleByDateRangeTable';
import ProductBestSaleByYearChart from '../components/ProductBestSaleByYearChart';
import ProductBestSaleByMonthChart from '../components/ProductBestSaleByMonthChart';
import ProductBestSaleByQuarterChart from '../components/ProductBestSaleByQuarterChart';
import ProductBestSaleByDateRangeChart from '../components/ProductBestSaleByDateRangeChart';

const AVAILABLE_YEARS = [2023, 2024, 2025];
const AVAILABLE_MONTHS = [1,2,3,4,5,6,7,8,9,10,11,12];
const AVAILABLE_QUARTERS = [1,2,3,4];

const REVENUE_SUBTABS = [
  { key: 'year', label: 'Theo năm', component: <YearlyRevenueChart /> },
  { key: 'month', label: 'Theo tháng', component: <MonthlyRevenueChart year={2025} /> },
  { key: 'quarter', label: 'Theo quý', component: <QuarterlyRevenueChart year={2025} /> },
  { key: 'day', label: 'Theo ngày' },
];


const BESTSALE_TIME_TABS = [
  { key: 'year', label: 'Theo năm' },
  { key: 'month', label: 'Theo tháng' },
  { key: 'quarter', label: 'Theo quý' },
  { key: 'day', label: 'Theo ngày' },
  { key: 'all', label: 'Toàn thời gian' },
];
const BESTSALE_VIEW_TABS = [
  { key: 'table', label: 'Bảng' },
  { key: 'barchart', label: 'Biểu đồ' },
];

const TABS = [
  { key: 'revenue', label: 'Doanh thu', subTabs: REVENUE_SUBTABS },
  { key: 'percent', label: 'Tỉ lệ bán ra', subTabs: [] },
  { key: 'bestsale', label: 'Sản phẩm bán chạy', subTabs: [] },
];

const ThongKeDoanhThu = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [activeSubTab, setActiveSubTab] = useState({
    revenue: REVENUE_SUBTABS[0].key,
    bestsale: BESTSALE_TIME_TABS[0].key,
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // State cho best sale
  const [bestSaleYear, setBestSaleYear] = useState(AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]);
  const [bestSaleMonth, setBestSaleMonth] = useState(AVAILABLE_MONTHS[new Date().getMonth()]);
  const [bestSaleQuarter, setBestSaleQuarter] = useState(1);
  const [bestSaleDayStart, setBestSaleDayStart] = useState('');
  const [bestSaleDayEnd, setBestSaleDayEnd] = useState('');

  // State riêng cho từng biểu đồ tỉ lệ bán ra
  const [percentYear, setPercentYear] = useState(AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]);
  const [percentMonthYear, setPercentMonthYear] = useState(AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]);
  const [percentMonth, setPercentMonth] = useState(AVAILABLE_MONTHS[new Date().getMonth()]);
  const [percentQuarterYear, setPercentQuarterYear] = useState(AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]);
  const [percentQuarter, setPercentQuarter] = useState(1);
  const [percentDayStart, setPercentDayStart] = useState('');
  const [percentDayEnd, setPercentDayEnd] = useState('');

  const [bestsaleTimeTab, setBestsaleTimeTab] = useState('month');
  const [bestsaleViewTab, setBestsaleViewTab] = useState('table');

  const currentTab = TABS.find(tab => tab.key === activeTab);
  const currentSubTabs = currentTab.subTabs;
  const currentSubTabKey = activeSubTab[activeTab];
  const currentSubTab = currentSubTabs.find(sub => sub.key === currentSubTabKey);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>Thống kê</h1>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, justifyContent: 'center' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab.key ? '#007bff' : '#eee',
              color: activeTab === tab.key ? '#fff' : '#333',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal',
              boxShadow: activeTab === tab.key ? '0 2px 8px #007bff33' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Sub-tabs cho các tab có subTabs */}
      {currentSubTabs.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, justifyContent: 'center' }}>
          {currentSubTabs.map(sub => (
            <button
              key={sub.key}
              onClick={() => setActiveSubTab(prev => ({ ...prev, [activeTab]: sub.key }))}
              style={{
                padding: '6px 14px',
                background: currentSubTabKey === sub.key ? '#17a2b8' : '#f0f0f0',
                color: currentSubTabKey === sub.key ? '#fff' : '#333',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: currentSubTabKey === sub.key ? 'bold' : 'normal',
                boxShadow: currentSubTabKey === sub.key ? '0 2px 8px #17a2b833' : 'none'
              }}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
      {/* Các input chọn ngày, tháng, quý, năm cho các loại thống kê phù hợp */}
      {activeTab === 'revenue' && currentSubTabKey === 'day' && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <label>Từ ngày:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <label>Đến ngày:</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      )}
      {/* Tỉ lệ bán ra: mỗi biểu đồ có input riêng */}
      {activeTab === 'percent' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fff' }}>
            <div style={{ marginBottom: 8 }}>
              <label>Chọn năm: </label>
              <select value={percentYear} onChange={e => setPercentYear(Number(e.target.value))}>
                {AVAILABLE_YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <YearlyPercentageOfSalesChart year={percentYear} />
          </div>
          <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fff' }}>
            <div style={{ marginBottom: 8 }}>
              <label>Năm: </label>
              <select value={percentMonthYear} onChange={e => setPercentMonthYear(Number(e.target.value))}>
                {AVAILABLE_YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <label style={{ marginLeft: 8 }}>Tháng: </label>
              <select value={percentMonth} onChange={e => setPercentMonth(Number(e.target.value))}>
                {AVAILABLE_MONTHS.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <MonthlyPercentageOfSalesChart year={percentMonthYear} month={percentMonth} />
          </div>
          <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fff' }}>
            <div style={{ marginBottom: 8 }}>
              <label>Năm: </label>
              <select value={percentQuarterYear} onChange={e => setPercentQuarterYear(Number(e.target.value))}>
                {AVAILABLE_YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <label style={{ marginLeft: 8 }}>Quý: </label>
              <select value={percentQuarter} onChange={e => setPercentQuarter(Number(e.target.value))}>
                {AVAILABLE_QUARTERS.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
            <QuarterlyPercentageOfSalesChart year={percentQuarterYear} quarter={percentQuarter} />
          </div>
          <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fff' }}>
            <div style={{ marginBottom: 8 }}>
              <label>Từ ngày: </label>
              <input type="date" value={percentDayStart} onChange={e => setPercentDayStart(e.target.value)} />
              <label style={{ marginLeft: 8 }}>Đến ngày: </label>
              <input type="date" value={percentDayEnd} onChange={e => setPercentDayEnd(e.target.value)} />
            </div>
            <DateRangePercentageOfSalesChart startDate={percentDayStart} endDate={percentDayEnd} />
          </div>
        </div>
      )}
      {activeTab === 'bestsale' && (
        <div style={{ display: 'flex', gap: 32, marginBottom: 24, justifyContent: 'center' }}>
          {/* Tab dọc/chọn dạng hiển thị */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BESTSALE_VIEW_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setBestsaleViewTab(tab.key)}
                style={{
                  padding: '8px 20px',
                  background: bestsaleViewTab === tab.key ? '#007bff' : '#eee',
                  color: bestsaleViewTab === tab.key ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontWeight: bestsaleViewTab === tab.key ? 'bold' : 'normal',
                  boxShadow: bestsaleViewTab === tab.key ? '0 2px 8px #007bff33' : 'none',
                  minWidth: 90
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab ngang/chọn mốc thời gian */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {BESTSALE_TIME_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setBestsaleTimeTab(tab.key)}
                style={{
                  padding: '8px 16px',
                  background: bestsaleTimeTab === tab.key ? '#17a2b8' : '#f0f0f0',
                  color: bestsaleTimeTab === tab.key ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontWeight: bestsaleTimeTab === tab.key ? 'bold' : 'normal',
                  boxShadow: bestsaleTimeTab === tab.key ? '0 2px 8px #17a2b833' : 'none',
                  minWidth: 110
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Input chọn thời gian cho best sale */}
      {activeTab === 'bestsale' && bestsaleTimeTab === 'year' && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <label>Chọn năm:</label>
          <select value={bestSaleYear} onChange={e => setBestSaleYear(Number(e.target.value))}>
            {AVAILABLE_YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}
      {activeTab === 'bestsale' && bestsaleTimeTab === 'month' && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <label>Năm:</label>
          <select value={bestSaleYear} onChange={e => setBestSaleYear(Number(e.target.value))}>
            {AVAILABLE_YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <label>Tháng:</label>
          <select value={bestSaleMonth} onChange={e => setBestSaleMonth(Number(e.target.value))}>
            {AVAILABLE_MONTHS.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      )}
      {activeTab === 'bestsale' && bestsaleTimeTab === 'quarter' && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <label>Năm:</label>
          <select value={bestSaleYear} onChange={e => setBestSaleYear(Number(e.target.value))}>
            {AVAILABLE_YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <label>Quý:</label>
          <select value={bestSaleQuarter} onChange={e => setBestSaleQuarter(Number(e.target.value))}>
            {AVAILABLE_QUARTERS.map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      )}
      {activeTab === 'bestsale' && bestsaleTimeTab === 'day' && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <label>Từ ngày:</label>
          <input type="date" value={bestSaleDayStart} onChange={e => setBestSaleDayStart(e.target.value)} />
          <label>Đến ngày:</label>
          <input type="date" value={bestSaleDayEnd} onChange={e => setBestSaleDayEnd(e.target.value)} />
        </div>
      )}
      {/* Render nội dung best sale theo dạng hiển thị và mốc thời gian */}
      {activeTab === 'bestsale' && (
        <div>
          {bestsaleViewTab === 'table' && bestsaleTimeTab === 'year' && (
            <ProductBestSaleByYearTable year={bestSaleYear} />
          )}
          {bestsaleViewTab === 'table' && bestsaleTimeTab === 'month' && (
            <ProductBestSaleByMonthTable year={bestSaleYear} month={bestSaleMonth} />
          )}
          {bestsaleViewTab === 'table' && bestsaleTimeTab === 'quarter' && (
            <ProductBestSaleByQuarterTable year={bestSaleYear} quarter={bestSaleQuarter} />
          )}
          {bestsaleViewTab === 'table' && bestsaleTimeTab === 'day' && (
            <ProductBestSaleByDateRangeTable startDate={bestSaleDayStart} endDate={bestSaleDayEnd} />
          )}
          {bestsaleViewTab === 'table' && bestsaleTimeTab === 'all' && (
            <ProductBestSaleTable />
          )}
          {bestsaleViewTab === 'barchart' && bestsaleTimeTab === 'year' && (
            <ProductBestSaleByYearChart year={bestSaleYear} />
          )}
          {bestsaleViewTab === 'barchart' && bestsaleTimeTab === 'month' && (
            <ProductBestSaleByMonthChart year={bestSaleYear} month={bestSaleMonth} />
          )}
          {bestsaleViewTab === 'barchart' && bestsaleTimeTab === 'quarter' && (
            <ProductBestSaleByQuarterChart year={bestSaleYear} quarter={bestSaleQuarter} />
          )}
          {bestsaleViewTab === 'barchart' && bestsaleTimeTab === 'day' && (
            <ProductBestSaleByDateRangeChart startDate={bestSaleDayStart} endDate={bestSaleDayEnd} />
          )}
          {bestsaleViewTab === 'barchart' && bestsaleTimeTab === 'all' && (
            <ProductBestSaleChart type="all" />
          )}
        </div>
      )}
      <div>
        {activeTab === 'revenue' && currentSubTabKey === 'day' ? (
          <DailyRevenueRangeChart startDate={startDate} endDate={endDate} />
        ) : activeTab === 'percent' ? (
          <></>
        ) : (
          currentSubTab?.component
        )}
      </div>
    </div>
  );
};

export default ThongKeDoanhThu;
