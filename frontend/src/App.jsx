import { useEffect, useState } from 'react';
import './App.css';
import Filter from './components/Filter';
import { fetchData } from '../services/fetchData';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import Templatechildren from './components/Template';
import LineChart from './components/LIneChart';
import HeatMap from './components/Heatmap';
import IntensityByYearChart from './components/IntensityByYear';


function App() {
  const [data, setData] = useState([]);

 
const [ActualDataToPass,setActualDataToPass]=useState([])
  const [Insights, setInsights] = useState({
    end_year: [],
    topic: [],
    sector: [],
    region: [],
    pestle: [],
    source: [],
    country: [],
    city: [],
  });
useEffect(()=>{console.log(ActualDataToPass);
},[ActualDataToPass])
  const [filters, setFilters] = useState({
    end_year: '',
    topic: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    country: '',
    city: ''
  });
  const fields = [
    'end_year',
    'topic',
    'pestle',
    'sector',
    'source',
    'region',
    'country',
    'city',
  
  ];
  

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetchData()

        console.log();
        
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetch();
  }, []);





  return (
    <div className="dashboard-bg min-h-screen flex flex-col items-center px-1 sm:px-4 md:px-8 py-4">
      <header className="dashboard-header max-w-screen fixed top-0 left-0 w-full grid col-span-3 row-span-4 shadow-lg z-50">
        <div className=" text-[20px] font-bold tracking-wide text-white mb-2 sm:mb-0">🌐 Insights Dashboard</div>
        <Filter
          fields={fields}
          filters={filters}
          setFilters={setFilters}
          Insights={Insights}
          setActualDataToPass={setActualDataToPass}
          setInsights={setInsights}
          data={data}
        />
      </header>

      <div className="w-full h-full mt-28">
        <main className="dashboard-main w-full max-w-6xl flex flex-col gap-6 sm:gap-10 mt-8 sm:mt-28 mb-6 sm:mb-10 px-0 sm:px-2">
          <section className="dashboard-section card w-full">
            <h2 className="section-title">Sector Intensity (Bar Chart)</h2>
            <Templatechildren
              children={<BarChart data={ActualDataToPass?.length <= 0 ? data : ActualDataToPass.filter((d) => Math.max(d.intensity) && d.sector)} />}
              data={ActualDataToPass?.length <= 0 ? data : ActualDataToPass.filter((d) => Math.max(d.intensity) && d.sector)}
            />
          </section>

          <section className="dashboard-section card w-full">
            <h2 className="section-title">Topic Relevance (Pie Chart)</h2>
            <Templatechildren
              children={<PieChart data={ActualDataToPass?.length <= 0 ? data : ActualDataToPass.filter((d) => Math.max(d.relevance) && d.topic && d.topic !== "")}/>}
              data={ActualDataToPass?.length <= 0 ? data : ActualDataToPass.filter((d) => Math.max(d.relevance) && d.topic && d.topic !== "")}
            />
          </section>

          <section className="dashboard-section card w-full">
            <h2 className="section-title">Sector Intensity Over Time (Line Chart)</h2>
            <Templatechildren
              children={<LineChart data={ActualDataToPass?.length <= 0 ? data : ActualDataToPass.filter((d) => Math.max(d.intensity) && d.sector)} />}
              data={ActualDataToPass?.length <= 0 ? data : ActualDataToPass.filter((d) => Math.max(d.intensity) && d.sector)}
            />
          </section>

          <section className="dashboard-section card w-full">
            <h2 className="section-title">Topic Relevance Heatmap</h2>
            <Templatechildren
              children={<HeatMap data={ActualDataToPass?.length <= 0 ? data : ActualDataToPass.filter((d) => Math.max(d.relevance) && d.topic && d.topic !== "")}/>}
              data={ActualDataToPass?.length <= 0 ? data : ActualDataToPass.filter((d) => Math.max(d.relevance) && d.topic && d.topic !== "")}
            />
          </section>

          <section className="dashboard-section card w-full">
            <h2 className="section-title">Intensity by Year</h2>
            <Templatechildren
              children={<IntensityByYearChart data={ActualDataToPass?.length > 0 ? ActualDataToPass.filter(d => d.end_year && d.intensity) : data} />}
              data={ActualDataToPass?.length > 0 ? ActualDataToPass.filter(d => d.end_year && d.intensity) : data}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
