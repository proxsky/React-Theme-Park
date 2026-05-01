import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import WaitTimeList from './WaitTimeList';
import NativeAd from './NativeAd';
import AdBanner from './AdBanner';

function App() {
  return (
    <Router>
      <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-blue-400 text-white p-4 text-center sticky top-0 z-10">
          <h1 className="text-xl font-bold">Theme Park Status</h1>
        </header>

        {/* Page Routing */}
        <main className="p-4 pt-0">
          <div className="m-2 text-center">
            <AdBanner />
          </div>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/park/:parkId" element={<WaitTimeList />} />
          </Routes>
          <NativeAd/>
        </main>
      </div>
    </Router>
  );
}

export default App;