import logo from './logo.svg';
import './App.css';
import WeatherApp from './components/WeatherApp';
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
function App() {
  return (
    <WeatherApp />
  );
}

export default App;
